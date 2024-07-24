
class TankerkoenigCard extends HTMLElement {

  // Whenever the state changes, a new `hass` object is set. Use this to
  // update your content.
  set hass(hass) {

      // set up shadowDom first
      if (!this.shadowDomInit) {
          return;
      }

      // render changes
      this.renderStations(hass);
  }

  //
  renderStations(hass) {

    this.config.stations.map((station, stationIndex) => {

      const statusData  = hass.states['binary_sensor.' + station + '_status'];
      if(!statusData) {
        setStationName(`<div class="station">No Data for ${ station }</div>`, station);
      }

      const oldData     = this.oldData[stationIndex];
      let stationName   = '';
      let stationStreet = '';
      const isOpen      = statusData.state == 'on';

      if(this.config.hide_closed_stations && !isOpen) {
        this.setVisibility(isOpen, station);
        this.oldData[stationIndex] ?
          this.oldData[stationIndex].isOpen = false : 
          this.oldData[stationIndex] = { isOpen };
        return;
      }

      const prices = this.config.types.map((type, index) => {

        const fuel    = hass.states['sensor.' + station + '_' + type];
        const attr    = fuel.attributes;
        stationName   = attr.brand;
        stationStreet = attr.street + ' ' + attr.house_number;
        const price   =  (isOpen ? fuel.state : '0,000');

        !oldData || price !== oldData.prices[index] ? this.setPrice(price, attr.unit_of_measurement, station + type) : null;

        return price;
      });

      !oldData || isOpen !== oldData.isOpen               ? this.setIcon(isOpen, station, stationIndex)   : null;
      !oldData || isOpen !== oldData.isOpen               ? this.setVisibility(isOpen, station)           : null;
      !oldData || stationName !== oldData.stationName     ? this.setStationName(stationName, station)     : null;
      !oldData || stationStreet !== oldData.stationStreet ? this.setStationStreet(stationStreet, station) : null;

      this.oldData[stationIndex] = {
        stationName,
        stationStreet,
        isOpen,
        prices
      };
    });
  }

  //
  setIcon(isOpen, id, index) {
    const elem = this.shadowRoot.getElementById(id + 'Icon');
    this.hasLogos && this.config.logos[index] ? 
      (elem.innerHTML = `<img src="${ this.config.logos[index] }">`) :
      (elem.innerHTML = isOpen
            ? `<ha-icon icon="mdi:gas-station-in-use-outline"></ha-icon>`
            : `<ha-icon icon="mdi:gas-station-outline"></ha-icon>`);
  }

  //
  setVisibility(isOpen, id) {
    const classes = this.shadowRoot.getElementById(id).classList;
    this.config.hide_closed_stations && !isOpen ? classes.add('hidden') : classes.remove('hidden');
  }

  //
  setPrice(price, unit, id) {
    const last = '<sup>' + price.charAt(price.length - 1) + '</sup>';
    this.shadowRoot.getElementById(id).innerHTML = price.slice(0, -1) + last + unit;
  }

  //
  setStationName(stationName, id) {
    this.shadowRoot.getElementById(id + 'Name').innerHTML = stationName;
  }

  //
  setStationStreet(stationStreet, id) {
    this.shadowRoot.getElementById(id + 'Street').innerHTML = stationStreet;
  }

  // The user supplied configuration. Throw an exception and Home Assistant
  // will render an error card.
  setConfig(config) {
      if (!config.stations || !config.types ||  !config.names) {
          throw new Error('You need to define at liest a station and a type of gasoline with a name.');
      }
      this.config = config;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
      return 5;
  }


  // setup basic card content  and functions
  connectedCallback() {
      this.oldData  = [];
      this.hasLogos = this.config.logos && this.config.logos.length;

      this.template = document.createElement('template');
      this.template.innerHTML = `
        ${this.getStyles()}
        <ha-card ${ this.config.title ? `header="${ this.config.title }"` : `` }>
          <div class="card-content">
            <div id="container">
              ${ 
                  this.config.stations.map((station) => {
                    return  `
                    <div class="station hidden" id="${ station }">
                      <div class="station-icon ${ this.config.grayscale ? 'grayscale' : ''}" id="${ station }Icon">       

                      </div>
                      <div class="station-data">
                        <span class="station-name" id="${ station }Name"></span>, 
                        <span class="station-street" id="${ station }Street"></span>
                        <div class="fuel-types">
                          ${
                            this.config.types.map((type, index) => { 
                              return `
                                <span class="fuel-info">
                                  ${ this.config.names[index] }:
                                  <span class="fuel-price" id="${ station + type }">0,000€</span>
                                </span>
                              `
                            }).join('')
                          }
                        </div>
                      </div>
                    </div>`
                  }).join('')
              }    
            </div>
          </div>
        </ha-card>
      `;

      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(this.template.content.cloneNode(true));
      this.$container = this.shadowRoot.querySelector('#container');

      this.shadowDomInit = true;
  }

  getStyles() {
      return `
      <style>
        .station {
          display: flex;
          align-items: center;
          margin-top: 8px;
          padding-bottom: 8px;
        }

        .station.hidden {
          display: none;
        }

        .station-icon {
          height: 40px;
          width: 40px;
          margin-right: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .station-icon.grayscale img {
          filter: grayscale(1);
        }

        .station-name {
          font-weight: bold;
        }

        .fuel-types {
          font-size: 12px;
          display: flex;
        }

        .fuel-info {
          display: flex;
          margin-right: 8px;
          align-items: baseline;
        }

        .fuel-price {
          font-size: 1.25em;
          font-weight: bold;
          padding-left: 4px;
        }

      </style>
      `;
  }
}

customElements.define("tankerkoenig-card", TankerkoenigCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "tankerkoenig-card",
  name: "Tankerkoenig Karte",
  preview: false, // Optional - defaults to false
  description: "Karte zum Anzeigen der von Tankstellen." // Optional
});
