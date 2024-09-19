// This function will be called by the main script to export the flood map as a GeoTIFF file via URL.

var getFloodGeoTIFFUrl = function(floodLayer, value, radius, aoi, cellSize, filename) {
  // Define a boxcar or low-pass kernel for smoothing.
  var boxcar = ee.Kernel.square({
    radius: radius, units: 'pixels', magnitude: 1
  });
  
  // Smoothen and threshold the binary flood raster
  var smooth_flood = floodLayer.eq(value).convolve(boxcar);
  var smooth_flood_binary = smooth_flood.updateMask(smooth_flood.gt(0.5)).gt(0);
  
  // Generate the download URL for the GeoTIFF
  var geotiff_url = smooth_flood_binary.getDownloadURL({
    name: filename,                      // Filename for the exported GeoTIFF
    region: aoi,                         // Area of interest (AOI) geometry
    scale: cellSize,                     // Spatial resolution (cell size in meters)
    crs: floodLayer.projection(),        // Coordinate Reference System (CRS)
    fileFormat: 'GeoTIFF'                // Export format set to GeoTIFF
  });
  
  // Return the download URL for the user to download the GeoTIFF directly
  return geotiff_url;
}

exports.getFloodGeoTIFFUrl = getFloodGeoTIFFUrl;
