import React from "react";
// react plugin used to create google maps
import {GoogleMap, Marker, withGoogleMap, withScriptjs} from "react-google-maps";
// core components


const MapWrapper = withScriptjs(
    withGoogleMap(props => 
    <GoogleMap
            defaultCenter= {props.defaultCenter}
            defaultZoom={props.zoom}
            defaultOptions={{
              scrollwheel: false,
            }}
        >
        {props.markers.map((props,index) =>{

          return(
          <Marker position={{lat: props.lat, lng: props.lng}}
           key={index}
           id={index}
           options={{icon:`/event_icon/${props.status}`}}
           onClick={(() => 
            { if(props.id)
                {window.location.href =`/#admin/event_details/${props.id}`}
              }
              )}
             />
            )})}
        </GoogleMap>
    ));
  
  const MapWrapper_details = withScriptjs(
    withGoogleMap(props => <GoogleMap
            center= {props.center}
            defaultZoom={props.zoom}
            defaultOptions={{
              scrollwheel: false,
            }}
        >
        {props.markers.map(props =>
          <Marker 
          position={{lat: props.lat, lng: props.lng}}
          options={{icon:`/event_icon/${props.status}`}}
           onClick={(() => 
            { if(props.id)
                {window.location.href =`/#admin/event_details/${props.id}`}
              }
              )}
             />
        )}
        </GoogleMap>
    ));

class Maps extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      lat: 0,
      lng: 0
    }
  }

  componentDidMount(){
    Promise.all([this.get_my_location()]).then((value) => {
      this.setState(
        {
          lat: value[0].coords.latitude,
          lng: value[0].coords.longitude
        })})
  }

  get_my_location = () => {
    if (navigator.geolocation) {
      return new Promise(
        (resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject)
      )
    } else {
      return new Promise(
        resolve => resolve({})
      )
    }
  }

  render() 
  {
    if (this.props.center)
      return(
        <MapWrapper_details
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDcLG_2KgktdQJXLaeyQZHJzmvcSjNwoPM"
        loadingElement={<div style={{ height: `100%` }} />}
        center = {this.props.center}
        zoom = {this.props.zoom}
        markers = {this.props.markers}
        containerElement={
            <div
                className="map-canvas"
                id="map-canvas"
            />
        }
        mapElement={this.props.mapElement}
    />
    )
    return (
    <MapWrapper
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDcLG_2KgktdQJXLaeyQZHJzmvcSjNwoPM"
        loadingElement={<div style={{ height: `100%` }} />}
        defaultCenter = {this.state}
        zoom = {this.props.zoom}
        markers = {this.props.markers}
        containerElement={
            <div
                className="map-canvas"
                id="map-canvas"
            />
        }
        mapElement={this.props.mapElement}
    />

    );
  }
}

export default Maps;
