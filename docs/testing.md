# Testing

## Introduction

Genie games developed by agencies working with the BBC must be tested as part of the development process. QA team members in BBC Children's will review the output of this testing at various points in the project delivery life cycle. These touch points happen most notably at Alpha (Test plan review), Beta (Representative device coverage and test case and execution reports review) and RC (Release Candidate - Full device coverage, test case execution reports review).

This end-to-end collaborative development process is outlined below:

<img src="./resources/gamesqaprocess.png" alt="gamesqaprocess" align="middle" width="600px" height="200px"/>

## Test Planning

All BBC Games projects require a Test Plan, outlining the various approaches undertaken during testing in order to ensure quality. These areas include, but are not limited to:

* Testing resources (who will do the testing?)
* Testing methodology (how the testing will happen)
* What tools and techniques will be used (bug-tracking, performance tools etc.)

[A test plan template has been provided here](./resources/testplantemplate.doc)

## Certification

BBC Children's require Genie games to go through the Games Certification Process. It is notable that the certification process is NOT a bug-finding service - our QA team check the technical deliverables, accessibility and performance aspects of the game using a standard list of test cases organised into various suites. An export of the tests that will be executed has been added to this starter pack for your reference and can be found here:

 [Genie Certification Test Outline](./resources/geniecertoutline.pdf)
 [Genie Certification Test Details](./resources/geniecertdetails.pdf)

## Devices

The digital experiences produced by BBC Children's have a unique audience. Children tend to use a wide range of devices; from older, less capable phones and tablets to newer devices with higher specifications. To enable us to support this range of devices we require that you enable aspects of the game to downgrade gracefully for less capable devices whilst taking advantage of those with better performance.

The game should provide the best possible experience for users across the identified range of devices.

The device list is regularly updated to reflect the changing market and will be reviewed and finalised on receipt of Alpha delivery. The list can be found in the RFP and the work order.
