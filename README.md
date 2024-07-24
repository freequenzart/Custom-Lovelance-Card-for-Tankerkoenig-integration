# Custom-Lovelace-Card-for-Tankerkoenig-integration
This is a special custom card for Home Assistant, to make it more easy to show alot of stations with different gasoline types.

**Hint:** Still work in progress!
 - start up looks a bit messy
 - code cleaning
 - commenting


## Attributes

| Name                 | Type      | Requirement  | Description                                    | Default             |
| -------------------- | --------- | ------------ | ---------------------------------------------- | ------------------- |
| type                 | string    | **Required** | `custom:tankerkoenig-card`                     |                     |
| stations             | string[ ] | **Required** | middle part of the generated sensors           | none                |
| types                | string[ ] | **Required** | gasoline types (like `diesel` or `super`)      | none                |
| names                | string[ ] | **Required** | names for the types (`Diesel` or `Super`)      | none                |
| logos                | string[ ] | **Optional** | pathes to the images, same order as `stations` | none                |
| title                | string    | **Optional** | The HA-Card Header                             | none                |
| hide_closed_stations | boolean   | **Optional** | if a station is closed, dont show it           | false               |
| grayscale            | boolean   | **Optional** | uses filter: grayscale for the logos           | false               |

**Hint:** `stations` are only the middle part of the generated sensors:
`sensor.my_gasstation_street_54_super`
<br>
`sensor.my_gasstation_street_54_diesel`
<br>
`binary_sensor.my_gasstation_street_54_status`

use only: `my_gasstation_street_54`!


## Example Config

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

## Logos
Logos have to be in the `www` directory, so that they can be used like in the example. If you dont want the logos, just remove the whole logos section. You can use all kind of images you want. The current icons are png's with a size by 36x36 pixel.

**Hint:** The Companies which own the Logos have the copyright!

## Hints for Tankerkoenig
You have to click double on API Key. the first time you get routed to the Terms!
