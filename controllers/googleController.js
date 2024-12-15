const initMap = (req, res) => {
    let googleMapKey = process.env.GOOGLE_MAP_KEY;
    const scriptTag = `<script id="googleMapsScript" src="https://maps.googleapis.com/maps/api/js?key=${googleMapKey}&libraries=marker" async defer></script>` 
    console.log("backedn initMap");
    res.send(scriptTag);
}

module.exports = {
    initMap,
}