import React from "react";
import L from "leaflet";
import { Helmet } from "react-helmet";
import { useTracker } from 'hooks';
import { commafy, friendlyDate } from 'lib/util';

import Layout from "components/Layout";
import Container from "components/Container";
import Map from "components/Map";

const LOCATION = {
  lat: 0,
  lng: 0,
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 2;

const { data: countries = [] } = useTracker({
  api: 'countries'
});

const { data: stats = {} } = useTracker({
  api: 'all',
});

const hasCountries = Array.isArray(countries) && countries.length > 0;

const dashboardStats = [
  {
    primary: {
      label: 'Total Cases',
      value: stats ? commafy(stats?.cases) : '-'
    },
    secondary: {
      label: 'Per 1 Million',
      value: stats ? commafy(stats?.casesPerOneMillion) : '-'
    }
  },
  {
    primary: {
      label: 'Total Deaths',
      value: stats ? commafy(stats?.deaths) : '-'
    },
    secondary: {
      label: 'Per 1 Million',
      value: stats ? commafy(stats?.deathsPerOneMillion) : '-'
    }
  },
  {
    primary: {
      label: 'Total Tests',
      value: stats ? commafy(stats?.tests) : '-'
    },
    secondary: {
      label: 'Per 1 Million',
      value: stats ? commafy(stats?.testsPerOneMillion) : '-'
    }
  }
];

// Note: if you're not familiar with the ?. syntax, it's called 
// Optional Chaining. This allows us to chain our properties without 
// worrying about if the objects exist. If stats is undefined, it will 
// simply return undefined instead of throwing an error.

const IndexPage = () => {
  async function MapEffect({ leafletElement: map } = {}) {
    console.log(stats);
    if (!hasCountries) return;

    const geoJson = {
      type: "FeatureCollection",
      features: countries.map((country = {}) => {
        const { countryInfo = {} } = country;
        const { lat, long: lng } = countryInfo;
        return {
          type: "Feature",
          properties: {
            ...country,
          },
          geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
        };
      }),
    };
    const geoJsonLayers = new L.GeoJSON(geoJson, {
      pointToLayer: (feature = {}, latlng) => {
        const { properties = {} } = feature;
        let updatedFormatted;
        let casesString;

        const { country, updated, cases, deaths, recovered } = properties;

        casesString = `${cases}`;

        if (cases > 1000) {
          casesString = `${casesString.slice(0, -3)}k+`;
        }

        if (updated) {
          updatedFormatted = new Date(updated).toLocaleString();
        }

        const html = `
          <span class="icon-marker">
            <span class="icon-marker-tooltip">
              <h2>${country}</h2>
              <ul>
                <li><strong>Confirmed:</strong> ${cases}</li>
                <li><strong>Deaths:</strong> ${deaths}</li>
                <li><strong>Recovered:</strong> ${recovered}</li>
                <li><strong>Last Update:</strong> ${updatedFormatted}</li>
              </ul>
            </span>
            ${casesString}
          </span>
        `;

        return L.marker(latlng, {
          icon: L.divIcon({
            className: "icon",
            html,
          }),
          riseOnHover: true,
        });
      },
    });
    geoJsonLayers.addTo(map);
  }

  const mapSettings = {
    center: CENTER,
    defaultBaseMap: "OpenStreetMap",
    zoom: DEFAULT_ZOOM,
    MapEffect,
  };

  return (
    <Layout pageName="home">
      <Helmet>
        <title>Home Page</title>
      </Helmet>

      <div className="tracker">
        <Map {...mapSettings} />
        <div className="tracker-stats">
          <ul>
            { dashboardStats.map(({ primary = {}, secondary = {} }, i) => {
              return (
                <li key={`Stat-${i}`} className="tracker-stat">
                  { primary.value && (
                    <p className="tracker-stat-primary">
                      { primary.value }
                      <strong>{ primary.label }</strong>
                    </p>
                  )}
                  { secondary.value && (
                    <p className="tracker-stat-secondary">
                      { secondary.value }
                      <strong>{ secondary.label }</strong>
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="tracker-last-updated">
            <p>
              Last Updated: { stats ? friendlyDate(stats?.updated) : '-' }
            </p>
          </div>
        </div>
      </div>

      <Container type="content" className="text-center home-start">
        <h2>Still Getting Started?</h2>
        <p>Run the following in your terminal!</p>
        {/* <Snippet>
          gatsby new [directory]
          https://github.com/colbyfayock/gatsby-starter-leaflet
        </Snippet> */}
        <p className="note">
          Note: Gatsby CLI required globally for the above command
        </p>
      </Container>
    </Layout>
  );
};

export default IndexPage;
