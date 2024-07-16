# Custom-Lovelance-Card-for-Tankerkoenig-integration
This is a special custom card for Home Assistant, to make it more easy to show alot of stations with different gasoline types.

[TBD]

## Example Config

**Hint:** `stations` are only the middle part of the gerated sensors:
`sensor.my_gasstation_street_54_super`
<br>
`sensor.my_gasstation_street_54_diesel`
<br>
`binary_sensor.my_gasstation_street_54_status`

use only: `my_gasstation_street_54`!

```yaml
type: custom:tankerkoenig-card
title: Gas Stations
hide_closed_stations: true
grayscale: true
logos:
  - /local/images/tankerkoenig-logos/aral.png
  - /local/images/tankerkoenig-logos/esso.png
  - /local/images/tankerkoenig-logos/jet.png
stations:
  - my_gasstation_street_54
  - my_gasstation_street_55
  - another_station_highway_12
types:
  - super
  - diesel
names:
  - Super
  - Diesel
```

Logos have to be in the `www` directory. The can be used. If you dont want the logos, just remove the whole logos section.

The Companies which own the Logos have the copyright!
