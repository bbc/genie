import subprocess
import os
import json
import re


LICENSE_FILE_PATTERNS = [
    r"^LICENSE$",
    r"^LICENSE[-.]\w+$",
    r"^LICENCE$",
    r"^LICENCE[-.]\w+$",
    r"^COPYING$",
    r"^README$"
]


LICENSE_PATTERNS = [
    ("ISC*", re.compile(r"The ISC License")),
    ("MIT*", re.compile(r"ermission\s+is\s+hereby\s+granted,\s+free\s+of\s+charge,\s+to\s+any")),
    ("BSD*", re.compile(r"edistribution and use in source and binary forms, with or withou")),
    # https://spdx.org/licenses/BSD-Source-Code.html
    ("BSD-Source-Code*", re.compile(r"edistribution and use of this software in source and binary forms, with or withou")),
    ("WTFPL*", re.compile(r"DO WHAT THE [C-U]{4} YOU WANT TO PUBLIC LICENSE")),
    ("ISC*", re.compile(r"\bISC\b")),
    ("MIT*", re.compile(r"\bMIT\b")),
    ("BSD*", re.compile(r"\bBSD\b")),
    ("WTFPL*", re.compile(r"\bWTFPL\b")),
    ("Apache*", re.compile(r"\bApache License\b")),
    # https,//creativecommons.org/publicdomain/zero/1.0/
    ("CC0-1.0*", re.compile(r"The\s+person\s+who\s+associated\s+a\s+work\s+with\s+this\s+deed\s+has\s+dedicated\s+the\s+work\s+to\s+the\s+public\s+domain\s+by\s+waiving\s+all\s+of\s+his\s+or\s+her\s+rights\s+to\s+the\s+work\s+worldwide\s+under\s+copyright\s+law,\s+including\s+all\s+related\s+and\s+neighboring\s+rights,\s+to\s+the\s+extent\s+allowed\s+by\s+law.\s+You\s+can\s+copy,\s+modify,\s+distribute\s+and\s+perform\s+the\s+work,\s+even\s+for\s+commercial\s+purposes,\s+all\s+without\s+asking\s+permission.", re.IGNORECASE)),
    ("GPL-{[0]}*", re.compile(r"\bGNU GENERAL PUBLIC LICENSE\s*Version ([^,]*)", re.IGNORECASE)),
    ("LGPL-{[0]}*", re.compile(r"(?:LESSER|LIBRARY) GENERAL PUBLIC LICENSE\s*Version ([^,]*)", re.IGNORECASE)),
    ("Public Domain*", re.compile(r"Public Domain", re.IGNORECASE)),
    ("Custom: {[0]}", re.compile(r"(https?:\/\/[-a-zA-Z0-9\/.]*)")),
    ("Custom: {[0]}", re.compile(r"SEE LICENSE IN (.*)", re.IGNORECASE)),
]


def get_license_from_package(path):
    with open(path) as file_handle:
        package = json.load(file_handle)
    license_field = package.get("license")

    if isinstance(license_field, dict):
        return license_field.get("type")
    if license_field:
        return license_field

    licenses_field = package.get("licenses")
    if licenses_field:
        if isinstance(licenses_field[0], dict):
            licenses_field = [license_data.get("type") for license_data in licenses_field]
        return " AND ".join(licenses_field)

    return None


def parse_license_file(path):
    with open(path) as file_handle:
        text = file_handle.read()
    for pattern in LICENSE_PATTERNS:
        match = pattern[1].search(text)
        if match:
            license_descriptor = pattern[0].format(match.groups())
            return license_descriptor

    return None


def get_license_from_file(path):
    for pattern in LICENSE_FILE_PATTERNS:
        for filename in os.listdir(path):
            basename = os.path.splitext(filename)[0]
            if not re.search(pattern, basename, re.IGNORECASE):
                continue
            license_descriptor = parse_license_file(os.path.join(path, filename))
            if license_descriptor:
                return license_descriptor

    return "License could not be determined".format()


def get_license(path):
    json_path = os.path.join(path, "package.json")
    license_descriptor = get_license_from_package(json_path)
    if license_descriptor:
        return license_descriptor

    return get_license_from_file(path)


def get_license_whitelist():
    with open(os.path.join(os.path.dirname(__file__), "licensewhitelist.json")) as file_handle:
        return json.load(file_handle)


def check_license(license_whitelist, path):
    license_descriptor = get_license(path)

    if isinstance(license_descriptor, basestring):
        if license_descriptor in license_whitelist:
            return (True, license_descriptor)

        match = re.search(r"^\((.*)\)$", license_descriptor)
        if match:
            license_descriptor = match.group(1)

        for multi_license in license_descriptor.split(" OR "):
            if multi_license in license_whitelist:
                return (True, license_descriptor)

        for multi_license in license_descriptor.split(" AND "):
            if multi_license not in license_whitelist:
                break
        else:
            return (True, license_descriptor)

    return (False, license_descriptor)


def get_package_whitelist():
    with open(os.path.join(os.path.dirname(__file__), "packagewhitelist.json")) as file_handle:
        whitelist = json.load(file_handle)
    return [whitelisted["package"] for whitelisted in whitelist]


def check_licenses():
    with open(os.devnull, "w") as devnull:
        process = subprocess.Popen(
            "npm ls --long --parseable".split(),
            stdout=subprocess.PIPE,
            stderr=devnull
        )

    invalid_packages = {}
    license_whitelist = get_license_whitelist()
    package_whitelist = get_package_whitelist()

    for line in iter(process.stdout.readline, b""):
        split_line = line.decode("utf-8").rstrip().split(":")
        package_name = split_line[1]
        package_path = split_line[0]
        license_valid, license_descriptor = check_license(license_whitelist, package_path)
        if license_valid:
            continue
        if package_name in package_whitelist:
            package_whitelist.remove(package_name)
            continue
        invalid_packages[package_name] = license_descriptor, package_path

    if invalid_packages:
        print "\nThe following packages did not pass the licensing whitelist:\n"
        for key, value in invalid_packages.iteritems():
            print "{0}:\n    {1[0]}\n    {1[1]}\n".format(key, value)
        exit(1)

    print "All dependencies have whitelisted licenses or are individually whitelisted."
    if package_whitelist:
        print "WARN - The following whitelisted packages were not present in your dependencies:"
        for package in package_whitelist:
            print "    {}".format(package)


if __name__ == "__main__":
    check_licenses()
