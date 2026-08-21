---
translationKey: mip-mcp9808
locale: en
title: MicroPython MCP9808 driver
summary: An installable single-file MicroPython driver for reading and configuring the Microchip MCP9808 temperature sensor over I2C.
category: software
status: maintained
period: 2024–present
role: Author
contribution: Designed and implemented the register-oriented driver and its public API, then developed the v2 architecture, MicroPython packaging, simulated register model, and Pico W hardware-test infrastructure.
problem: Expose the MCP9808's temperature, resolution, low-power, and alert functions through a portable MicroPython interface with predictable costs on constrained microcontrollers.
approach: Model one sensor as an MCP9808 object bound to an I2C-compatible bus and address, map its 8- and 16-bit registers to explicit operations, reuse fixed transfer buffers, and expose cached configuration state plus integer and floating-point temperature paths.
technology:
  - MicroPython
  - Python
  - I2C
  - Raspberry Pi Pico W
  - Microchip MCP9808
  - mpremote
  - Python unittest
outcome: Version 2.0.0 published with mip and frozen-firmware metadata, semantic-versioned tags, dependency-free register-model tests, Pico W hardware tests, and a datasheet-oriented implementation guide.
attribution: Personal open-source project by Marco Miano, released under the MIT License. MCP9808 is a Microchip Technology product; the project is independent and is not affiliated with or endorsed by Microchip Technology.
links:
  - label: Source repository
    url: https://github.com/MarcoMiano/mip-mcp9808
featured: false
draft: true
noindex: true
---

## Register-oriented driver model

An `MCP9808` instance binds an I2C-compatible object to either an explicit seven-bit address or one assembled from the A0, A1, and A2 pins. The module defines the sensor's register addresses and configuration masks directly, without depending on concrete `machine.I2C` classes, and uses one two-byte buffer plus one one-byte buffer for all transfers.

The configuration register is represented as a cached snapshot. `refresh()` performs one explicit read and updates hysteresis, shutdown, lock, alert, polarity, and mode properties; setters assemble the corresponding bit fields, write the register, and refresh the snapshot. Optional identity verification reads the Microchip manufacturer and device identifiers without making those transactions mandatory for every construction path.

Temperature data follows the sensor's signed sixteenth-degree register representation, with a Celsius float wrapper for convenience. Alert thresholds likewise have exact signed quarter-degree operations alongside the float API. The same interface covers resolution, low-power state, hysteresis, comparator or interrupt behavior, polarity, threshold selection, and the MCP9808's power-cycle-reset register locks.

## Package and test infrastructure

The repository separates deployment and validation concerns: `package.json` supports installation through `mip`, while `manifest.py` supports freezing the module into MicroPython firmware with line-preserving optimization. Versioned tags and a changelog distinguish the original API from the breaking v2 interface.

Host tests use a dependency-free `FakeI2C` register map that models identity registers, temperatures, alert flags, configuration locks, the self-clearing interrupt bit, and transaction counts. A separate Pico W suite exercises power cycling and the physical sensor and alert output; an on-device script is retained for repeatable timing and allocation measurements without making a specific benchmark result the project's main outcome.
