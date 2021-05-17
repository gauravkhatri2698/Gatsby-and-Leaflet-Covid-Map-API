import React, { useRef } from "react";
import PropTypes from "prop-types";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";

import { useConfigureLeaflet, useMapServices, useRefEffect } from "hooks";
import { isDomAvailable } from "lib/util";

const Map = () => {
  const {
    children,
    className,
    defaultBaseMap = "OpenStreetMap",
    MapEffect,
    ...rest
  } = this.props;

  const mapRef = useRef();

  useConfigureLeaflet();

  useRefEffect({
    ref: mapRef,
    effect: MapEffect,
  });

  const services = useMapServices({
    names: ["OpenStreetMap"],
  });
  const basemap = services.find((service) => service.name === defaultBaseMap);

  let mapClassName = `map`;

  if (className) {
    mapClassName = `${mapClassName} ${className}`;
  }

  if (!isDomAvailable()) {
    return (
      <div className={mapClassName}>
        <p className="map-loading">Loading map...</p>
      </div>
    );
  }

  const mapSettings = {
    className: "map-base",
    zoomControl: false,
    ...rest,
  };

  return (
    <div className={mapClassName}>
      <MapContainer innerRef={mapRef} {...mapSettings}>
        {children}
        {basemap && <TileLayer {...basemap} />}
        <ZoomControl position="bottomright" />
      </MapContainer>
    </div>
  );
};

Map.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  defaultBaseMap: PropTypes.string,
  mapEffect: PropTypes.func,
};

export default Map;
