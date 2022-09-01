#!/bin/bash

while read p; do
  TexturePacker --format phaser --sheet $p.png --data $p.json $p
  TexturePacker --format phaser --texture-format pvr3 --opt PVRTCI_4BPP_RGBA --sheet $p.pvr --data $p-pvr.json $p
  TexturePacker --format phaser --texture-format pvr3 --opt ETC2_RGBA --sheet $p-ETC2.pvr --data $p-ETC2.json $p
  TexturePacker --format phaser --texture-format pvr3 --opt DXT5 --sheet $p-DXT5.pvr --data $p-DXT5.json $p
done <textures-to-compress.txt