const OFFICE_LOCATION = { latitude: 4.8301, longitude: 7.034431 };
const OFFICE_RADIUS_METERS = 200;
const DISTANCE_TOLERANCE_METERS = 0.000001;
const EARTH_RADIUS_METERS = 6_371_000;

const getDistanceInMeters = (first, second) => {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const latitudeDifference = toRadians(second.latitude - first.latitude);
  const longitudeDifference = toRadians(second.longitude - first.longitude);
  const haversine =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(toRadians(first.latitude)) *
      Math.cos(toRadians(second.latitude)) *
      Math.sin(longitudeDifference / 2) ** 2;

  return (
    2 *
    EARTH_RADIUS_METERS *
    Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
  );
};

export const getOfficeLocation = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Location access is not available in this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const location = {
          latitude: coords.latitude,
          longitude: coords.longitude,
        };
        const distance = getDistanceInMeters(OFFICE_LOCATION, location);

        if (distance > OFFICE_RADIUS_METERS + DISTANCE_TOLERANCE_METERS) {
          reject(
            new Error(
              "Kindly ensure you are at the Zyetech office before marking your attendance.",
            ),
          );
          return;
        }

        resolve(location);
      },
      (error) => {
        const message =
          error.code === error.PERMISSION_DENIED
            ? "Allow location access to mark attendance."
            : error.code === error.POSITION_UNAVAILABLE
              ? "Your location could not be determined. Please try again."
              : error.code === error.TIMEOUT
                ? "Location lookup timed out. Please try again."
                : "Unable to get your location. Please try again.";
        reject(new Error(message));
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 },
    );
  });
