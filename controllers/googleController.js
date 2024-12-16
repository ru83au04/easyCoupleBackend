const initMap = (req, res) => {
    let googleMapKey = process.env.GOOGLE_MAP_KEY;
    const scriptTag = `<script async id="googleMapsScript" src="https://maps.googleapis.com/maps/api/js?key=${googleMapKey}&loading=async&callback=initMap&libraries=map,marker">`
    console.log("backedn initMap");
    res.send(scriptTag);
}

module.exports = {
    initMap,
}