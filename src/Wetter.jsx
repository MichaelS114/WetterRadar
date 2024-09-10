import React, { useEffect, useState, useCallback } from 'react';
import 'leaflet/dist/leaflet.css';
import './CSS/wetter.css';

import { MapContainer, TileLayer, Popup, useMap, Circle, useMapEvents } from 'react-leaflet';
import RadarFrame from "./RadarFrame";
import { FaBackward, FaForward, FaPlay, FaPause, FaLocationPin } from "react-icons/fa6";
import { BsSearch } from "react-icons/bs";
import { Slider, Switch } from "@mui/material";
import Spinner from './Spinner';
import { BsXLg, BsSun, BsWind } from "react-icons/bs";
import { Transition } from '@headlessui/react'
import useScreenSize from './useScreenSize';
import { FaAngleLeft, FaAngleRight, FaGear } from "react-icons/fa6";
import { Marker } from '@adamscybot/react-leaflet-component-marker';

function Wetter({ coordinates, timezone }) {
  const [lightningData, setLightningData] = useState([]);
  // 
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [frame, setFrame] = useState(12);
  const [play, setPlay] = useState(false);
  const [times, setTimes] = useState(null);
  const [labels, setLabels] = useState(null);
  const [results, setResults] = useState([]);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [coordinatesChanged, setCoordinatesChanged] = useState(false);
  const [showRadar, setShowRadar] = useState(true);
  const [showLightning, setShowLightning] = useState(true);
  const [settings, setSettings] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  // 1 = radar
  var mapInstance;
  const [layer, setLayer] = useState("radar");
  const screenSize = useScreenSize();
  const primaryColor = "#0369a1";
  const [markers, setMarkers] = useState([]);



  const handleButton = () => {
    if (play === false) {
      setPlay(true);
    } else {
      setPlay(false);
    }
  };

  const nextF = () => {
    if (frame + 1 > 15) {
      setFrame(0);
    } else setFrame(frame + 1);
  }

  const prevF = () => {
    if (frame - 1 < 0) {
      setFrame(15);
    } else setFrame(frame - 1);
  }

  const incrementFrame = useCallback(() => {
    setFrame((prevFrame) => prevFrame + 1);
  }, []);
  // plays 1 second interval over 15 precipitation frames
  const handleSlider = (e) => {
    setFrame(e.target.value);
  };
  const getTimes = (times) => {
    let arr = [];
    const labels = () => {
      for (let i = 0; i < times.length; i++) {
        const timeLabels = {
          value: i,
          label: times[i],
        };
        arr.push(timeLabels);
      }
      return arr;
    };
    const staticLabels = () => {
      let arr = [];
      for (let i = 0; i < times.length; i++) {
        const timeLabels = {
          value: i,
          label: times[i],
        };
        const noLabel = {
          value: i,
        };
        if (i % 2 !== 0) {
          arr.push(noLabel);
        } else {
          arr.push(timeLabels);
        }
      }
      return arr;
    };
    setLabels(staticLabels);
    setTimes(labels);
  };
  const getSliderLabels = () => {
    if ((times[frame] !== undefined && times[frame] !== null) || times.length + 1 <= frame) {
      return times[frame].label;
    }
  };
  useEffect(() => {
    if (play) {
      if (frame > 15) {
        setFrame(0);
        return;
      }
      const timeoutFunction = setInterval(incrementFrame, 750);
      return () => clearInterval(timeoutFunction);
    }
  }, [incrementFrame, frame, play]);
  useEffect(() => {
    setCoordinatesChanged(true);
  }, [coordinates]);
  useEffect(() => {
    setCoordinatesChanged(false);
  }, [coordinatesChanged]);
  function ChangeMapView({ coords, coordinatesChanged }) {
    const map = useMap();
    if (coordinatesChanged) {
      map.setView(coords, map.getZoom());
    }
    return null;
  }

  //User Position

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
        drawMarker(position.coords.latitude, position.coords.longitude)
        console.log([position.coords.latitude, position.coords.longitude])
      }, (error) => {
        console.error("Error getting location: ", error);
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };


  const drawMarker = (lat, lon) => {
    var markersNew = [];
    // console.log(data);
      markersNew.push({
        position: [lat, lon],
      });
    // console.log(markersNew)
    setMarkers(markersNew);
  }

  const MarkerIcon = ({}) => {
    const map = useMap();
    mapInstance = map;
    
      return( 
        <div className={`h-10 w-10 rounded-full bg-sky-700 flex justify-center shadow-xl items-center`}>
          <FaLocationPin className='h-12 fill-white'/>
          </div>
      )
  }

  const SwitchComponent = ({ checked, onChange, label }) => {
    return (
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          value=""
          className="sr-only peer"
          checked={checked}
          onChange={onChange}
        />
        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 dark:peer-focus:ring-gray-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-black"></div>
        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{label}</span>
      </label>
    );
  }

  return (
    <>
      <div className='flex flex-1 h-full w-full relative text-black'>
        {/* Searchbar */}
        {/* https://nominatim.openstreetmap.org/search?city=Linz&format=json&featuretype=city&limit=5&countrycodes=at */}
        <div className='flex top-10 left-10 w-80 h-fit z-50 flex-col absolute sm:hidden md:flex'>
          {weather &&
            <div className='flex h-fit w-full bg-white flex-col p-2 box-border rounded-xl shadow-lg border-gray-200 border-[1px]'>
              <Transition
                show={weather !== null}
                enter="transition-h duration-300"
                enterFrom="h-0"
                enterTo="h-fit"
                leave="transition-opacity duration-150"
                leaveFrom="h-fit"
                leaveTo="h-0"
              >
                <div>
                  <div className='flex flex-row h-fit w-full'>
                    <div>
                      <div className='text-xl font-semibold'>{weather.location.name}</div>
                      <div className='text-sm'>{weather.location.region}</div>
                    </div>
                  </div>
                  <div className='my-4 flex flex-row w-full h-fit items-center justify-between px-2 box-border text-sm'>
                    <div className='text-xl min-w-14'>{weather.current.temp_c} °C</div>
                    <img src={weather.current.condition.icon} className='h-12 w-12 mx-1'></img>
                    <div>{weather.current.condition.text}</div>
                  </div>
                  <div className='flex flex-row gap-5 text-sm'>
                    <div className='flex flex-row gap-1 items-center'><BsSun />UV-Index: {weather.current.uv}</div>
                    <div className='flex flex-row gap-1 items-center'><BsWind />Windstärke: {weather.current.wind_kph} km/h</div>
                  </div>
                  {/* <div className='h-fit w-full mt-4 border-t-[1px] border-gray-200'>
                  <div className='mt-2'>Vorhersage</div>
                  <div className='w-full h-fit overflow-x-scroll overflow-y-hidden flex flex-row gap-1'>
                    {forecast && forecast.filter(e => parseInt(e.time_epoch.toString() + '000') > new Date().getMilliseconds()).map(e => 
                      <div className='bg-blue-100 h-fit min-w-10 p-2 rounded-md box-border my-2'>{e.temp_c}</div>
                    )}
                  </div>
                </div> */}
                </div>
              </Transition>
            </div>
          }
        </div>
        {(!times && lightningData.length === 0) && <Spinner />}
        {/* <Navbar scrollEffect={false} /> */}
        <div id='map'>
          <MapContainer center={[48.200859, 13.965986]} zoom={9} scrollWheelZoom={true} zoomControl={false}>
              <TileLayer url='https://www.google.at/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}'/>
            {showRadar && <RadarFrame index={frame} getTimes={getTimes} timezone={timezone} />}
            {markers.map((marker, idx) => (
                  <Marker
                    position={[marker.position[0], marker.position[1]]}
                    key={`marker-${idx}`}
                    icon={
                      <MarkerIcon
                        value={marker.val}
                        data={marker.data}
                        index={marker.index}
                      />
                    }
                  />
                ))}
          </MapContainer>

        </div>
        {/* Toolbar */}
        {screenSize.device !== 'mobile' ? (
          <div className='w-full h-fit justify-center flex absolute z-50 md:bottom-10 sm:bottom-[90px]'>
            <div className='h-12 w-fit rounded-xl bg-white flex shadow-lg items-center border-gray-200 border-[1px]'>
              {times && (
                <>
                  <div className="sm:ml-3 ml-2">
                    <button onClick={handleButton} className="mx-2 m-3">
                      {(play && <FaPause color={primaryColor} className="" />) || (!play && <FaPlay color={primaryColor} className="" />)}
                    </button>
                  </div>
                  <div className="sm:w-[300px] md:w-[400px] sm:pl-4 pl-2 pr-5 text-xs">
                    <Slider
                      className="mb-5 mt-2"
                      aria-label="Temperature"
                      value={frame}
                      valueLabelFormat={getSliderLabels}
                      valueLabelDisplay="auto"
                      step={1}
                      marks={labels}
                      min={0}
                      max={15}
                      onChange={handleSlider}
                      sx={{
                        "span": { fontSize: ".65rem" },
                        "&& .MuiSlider-rail": {
                          color: "#000",
                        },
                        "&& .MuiSlider-markLabel": {
                          paddingLeft: "0rem",
                        },
                        "&& .MuiSlider-track": {
                          color: "#000",
                        },
                        "&& .MuiSlider-thumb": {
                          color: "#000",
                          height: 14,
                          width: 14,
                        },
                        "&& .MuiSlider-thumb:hover": {
                          boxShadow: "0px 0px 0px 8px rgba(0, 0, 0, 0.1)",
                        },
                        "&& .MuiSlider-mark": {
                          display: "none",
                        },
                      }}
                    />

                  </div>

                </>

              )}
          
            </div>
          </div>
        ) : (
          // Mobile Toolbar
          <>
            <div className='w-full h-fit justify-center flex absolute z-50 bottom-[60px]'>
              <div className='font-semibold mx-4 text-sky-700 w-14 flex justify-center bg-white shadow-lg rounded-xl items-center border-gray-200 border-[1px]'>{times && times[frame].label}</div>
              <div className='h-12 w-74 flex-col justify-center bg-white flex shadow-lg rounded-xl items-center border-gray-200 border-[1px]'>
                <div className='flex flex-row items-center justify-center w-full'>
                  <button className='p-4 mx-2 ml-auto' onClick={() => prevF()}><FaAngleLeft color={primaryColor} /></button>
                  <button onClick={handleButton} className="p-4 mx-2">
                    {(play && <FaPause color={primaryColor} className="" />) || (!play && <FaPlay color={primaryColor} className="" />)}
                  </button>
                  <button className='p-4 mx-2 mr-auto' onClick={() => nextF()}><FaAngleRight color={primaryColor} /></button>
                </div>
              </div>
              <div className='font-semibold mx-4 text-sky-700 w-14 flex justify-center bg-white shadow-lg rounded-xl items-center border-gray-200 border-[1px]' onClick={() => handleGetLocation()}><FaLocationPin/></div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Wetter;
