<template>
  <div id="mapContainer" style="position: relative">
    <v-btn
      color="info"
      style="position: absolute; bottom: 25px; left: 25px; z-index: 500"
      @click="$router.push('/drawArea')"
      ><v-icon class="ml-1">mdi-draw</v-icon>Draw area</v-btn
    >
  </div>

  <v-dialog v-model="detailsDialog" width="500">
    <v-card class="pa-5 rounded-xl" dir="ltr">
      <v-card-title style="font-size: 1.5rem">Details</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <div class="mb-3">
          <b>Name: </b><span>{{ selectedData.name }}</span>
        </div>
        <div class="mb-3">
          <b>Lat: </b><span>{{ selectedData.lat }}</span>
        </div>
        <div>
          <b>Lng: </b><span>{{ selectedData.lng }}</span>
        </div>

        <div class="mt-8">
          <v-btn
            block
            height="42"
            color="info"
            variant="tonal"
            class="rounded-lg"
            @click="detailsDialog = false"
          >
            Done
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="snackbar" :timeout="2000" color="error" location="top">
    <div class="pr-1">The desired point must be in the specified areas</div>
  </v-snackbar>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "/public/Tween.js";
import "/public/leaflet.curve.js";
import * as turf from "@turf/turf";

export default {
  name: "LeafletMap",
  data() {
    return {
      map: null,
      marker: [],
      snackbar: false,
      prePosition: {},
      selectedData: {},
      singleMarker: null,
      currentPosition: {},
      detailsDialog: false,
    };
  },

  mounted() {
    this.getData();

    // var customIcon = L.icon({
    //   iconUrl:
    //     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRREL5LqMVocXxFordnamXI9pnZbqEO0FMxMYVqozZgdHFMvbLbwt2pxKo226VI9R_n-VQ&usqp=CAU",
    //   iconSize: [38, 38],
    //   shadowAnchor: [4, 62],
    // });

    // var marker = L.marker([35.79767659207426, 51.416657591801254], {
    //   icon: customIcon,
    //   draggable: true,
    // }).addTo(this.map);

    // L.marker([35.79545819024581, 51.413294838992286], {
    //   icon: customIcon,
    // }).addTo(this.map);
    // L.marker([35.79404841031678, 51.41468958754771], {
    //   icon: customIcon,
    // }).addTo(this.map);
    // L.marker([35.7953506253946, 51.416657591801254], {
    //   icon: customIcon,
    // }).addTo(this.map);
    // // ------------------------------------------------------------------
    // L.marker([35.80038118315376, 51.42163690778992]).addTo(this.map);
    // L.marker([35.7989453849228, 51.42010268437895]).addTo(this.map);
    // L.marker([35.79797076770211, 51.42119702555321]).addTo(this.map);
    // L.marker([35.799415285382224, 51.423149673530794]).addTo(this.map);

    // marker.on("dragend", function (event) {
    //   var marker = event.target;
    //   var position = marker.getLatLng();

    //   console.log("Marker dragged to:", position);
    //   // You can perform actions with the new marker position here
    // });

    // var pathOne = L.curve(
    //   [
    //     "M",
    //     [35.79767659207426, 51.416657591801254],
    //     "Q",
    //     [35.79545819024581, 51.413294838992286],
    //     [35.79545819024581, 51.413294838992286],
    //   ],
    //   {
    //     renderer: canvasRenderer,
    //     color: "red",
    //   }
    // ).addTo(this.map);
    // L.curve(
    //   [
    //     "M",
    //     [35.79545819024581, 51.413294838992286],
    //     "Q",
    //     [35.79404841031678, 51.41468958754771],
    //     [35.79404841031678, 51.41468958754771],
    //   ],
    //   {
    //     renderer: canvasRenderer,
    //   }
    // ).addTo(this.map);
    // L.curve(
    //   [
    //     "M",
    //     [35.79404841031678, 51.41468958754771],
    //     "Q",
    //     [35.7953506253946, 51.416657591801254],
    //     [35.7953506253946, 51.416657591801254],
    //   ],
    //   {
    //     renderer: canvasRenderer,
    //   }
    // ).addTo(this.map);
    // L.curve(
    //   [
    //     "M",
    //     [35.7953506253946, 51.416657591801254],
    //     "Q",
    //     [35.79767659207426, 51.416657591801254],
    //     [35.79767659207426, 51.416657591801254],
    //   ],
    //   {
    //     renderer: canvasRenderer,
    //   }
    // ).addTo(this.map);
    // L.curve(
    //   [
    //     "M",
    //     [35.80038118315376, 51.42163690778992],
    //     "Q",
    //     [35.80034637623082, 51.42013487088408],
    //     [35.7989453849228, 51.42010268437895],
    //   ],
    //   {
    //     renderer: canvasRenderer,
    //   }
    // ).addTo(this.map);
    // L.curve(
    //   [
    //     "M",
    //     [35.7989453849228, 51.42010268437895],
    //     "Q",
    //     [35.79821007214499, 51.420303850035985],
    //     [35.79797076770211, 51.42119702555321],
    //   ],
    //   {
    //     renderer: canvasRenderer,
    //   }
    // ).addTo(this.map);
    // L.curve(
    //   [
    //     "M",
    //     [35.79797076770211, 51.42119702555321],
    //     "Q",
    //     [35.79826228392762, 51.42290022811608],
    //     [35.799415285382224, 51.423149673530794],
    //   ],
    //   {
    //     renderer: canvasRenderer,
    //   }
    // ).addTo(this.map);
    // L.curve(
    //   [
    //     "M",
    //     [35.799415285382224, 51.423149673530794],
    //     "Q",
    //     [35.800207148386605, 51.42301288088401],
    //     [35.80038118315376, 51.42163690778992],
    //   ],
    //   {
    //     renderer: canvasRenderer,
    //   }
    // ).addTo(this.map);

    // var circle = L.circle([35.79528428181449, 51.421390821189995], {
    //   color: "#ccc",
    //   fillColor: "gray",
    //   fillOpacity: "0.2",
    //   radius: 200,
    // }).addTo(this.map);

    // var polygon = L.polygon([
    //   [35.79767186852838, 51.4122719373667],
    //   [35.795405512352794, 51.41329264192408],
    //   [35.79864601405017, 51.40843043544634],
    // ]).addTo(this.map);

    // marker.on("click", (event) => {
    //   console.log(event);
    //   this.selectedData = event.latlng;
    //   this.detailsDialog = true;
    // });

    // marker.bindPopup("<b>Hey there!</b>").openPopup;
  },

  onBeforeUnmount() {
    if (this.map) {
      this.map.remove();
    }
  },

  beforeRouteLeave(to, from, next) {
    if (to.path == "/drawArea") {
      window.location.href = "/drawArea";
    } else {
      next();
    }
  },

  methods: {
    getData() {
      this.mapData = {
        layers: [
          {
            type: "polyline",

            points: [
              {
                lat: "35.7947472415626",
                lng: "51.432209317771964",
                name: "اسکوتر شماره 1",
              },
              {
                lat: "35.794738539216226",
                lng: "51.42949492250642",
                name: "اسکوتر شماره 2",
              },
              {
                lat: "35.79372035811043",
                lng: "51.430224483289244",
                name: "اسکوتر شماره 3",
              },
              {
                lat: "35.79352020131584",
                lng: "51.430589263680666",
                name: "اسکوتر شماره 4",
              },
              {
                lat: "35.792806594727786",
                lng: "51.43070728086612",
                name: "اسکوتر شماره 5",
              },
              {
                lat: "35.792232223794805",
                lng: "51.43202692757625",
                name: "اسکوتر شماره 6",
              },
              {
                lat: "35.79243238383365",
                lng: "51.432842319039416",
                name: "اسکوتر شماره 7",
              },
              {
                lat: "35.79238016821996",
                lng: "51.43364698166755",
                name: "اسکوتر شماره 8",
              },
            ],
          },

          {
            type: "polygon",

            points: [
              {
                lat: "35.79382848561725",
                lng: "51.43623411655426",
              },
              {
                lat: "35.79267975435009",
                lng: "51.43645942211152",
              },
              {
                lat: "35.79287556199015",
                lng: "51.43810629844666",
              },
              {
                lat: "35.79385459295306",
                lng: "51.43811702728272",
              },
              {
                lat: "35.79400253436057",
                lng: "51.43773078918458",
              },
            ],
          },

          {
            type: "circle",
            points: [
              {
                lat: "35.79378606761215",
                lng: "51.43173310495744",
              },
            ],
            radius: 250,
          },
        ],
      };

      setTimeout(() => {
        // ---------------------------------------------------------------
        // --------------------- Map config / Start ----------------------
        // ---------------------------------------------------------------
        this.map = L.map("mapContainer").setView(
          [35.79378606761215, 51.43173310495744],
          18
        );
        L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.map);
        var customPane = this.map.createPane("customPane");
        var canvasRenderer = L.canvas({ pane: "customPane" });
        customPane.style.zIndex = 399;
        // -------------------------------------------------------------
        // --------------------- Map config / End ----------------------
        // -------------------------------------------------------------

        // Custom icon
        var customIcon = L.icon({
          iconUrl: "/scooter.svg",
          iconSize: [75, 75],
          iconAnchor: [35, 50],
        });

        this.mapData.layers.forEach((layer) => {
          if (layer.type == "polyline") {
            // Markers
            layer.points.forEach((element, i) => {
              this.marker[i] = L.marker([element.lat, element.lng], {
                // draggable: true,
                icon: customIcon,
              }).addTo(this.map);

              this.marker[i].on("click", () => {
                this.selectedData = element;
                this.detailsDialog = true;
              });
            });

            // Lines
            layer.points.forEach((element, index) => {
              if (index != layer.points.length - 1) {
                L.curve(
                  [
                    "M",
                    [layer.points[index].lat, layer.points[index].lng],
                    "Q",
                    [layer.points[index + 1].lat, layer.points[index + 1].lng],
                    [layer.points[index + 1].lat, layer.points[index + 1].lng],
                  ],
                  {
                    renderer: canvasRenderer,
                  }
                ).addTo(this.map);
              }
            });
          } else if (layer.type == "circle") {
            var circle = L.circle([layer.points[0].lat, layer.points[0].lng], {
              color: "#ccc",
              fillColor: "gray",
              fillOpacity: "0.2",
              radius: 250,
            }).addTo(this.map);
          } else if ("polygon") {
            var polygonPoints = [];
            layer.points.forEach((element) => {
              polygonPoints.push([element.lat, element.lng]);
            });
            var polygon = L.polygon(polygonPoints).addTo(this.map);
          }
        });

        this.singleMarker = L.marker([35.793249770804536, 51.43691003322602], {
          draggable: true,
          icon: customIcon,
        }).addTo(this.map);

        this.singleMarker.on("mousedown", function (event) {
          this.prePosition = event.target.getLatLng();
        });

        this.singleMarker.on("dragend", function (event) {
          this.currentPosition = event.target.getLatLng();
          setTimeout(() => {
            doCheck(this.currentPosition, this.prePosition);
          }, 200);
        });
      }, 100);

      const doCheck = (point, prePoint) => {
        this.checkIsInside(point, prePoint);
      };
    },

    checkIsInside(point, prePoint) {
      // Check if the point is inside the polygon
      var polygonPoints = this.mapData.layers.filter(
        (x) => x.type == "polygon"
      )[0].points;
      var polygon = [];
      polygonPoints.forEach((element) => {
        polygon.push([Number(element.lat), Number(element.lng)]);
      });
      polygon.push([
        Number(polygonPoints[0].lat),
        Number(polygonPoints[0].lng),
      ]);
      var isInsideOfPolygon = turf.booleanPointInPolygon(
        turf.point([Number(point.lat), Number(point.lng)]),

        turf.polygon([polygon])
      );
      console.log(isInsideOfPolygon);

      // Check if the point is inside the circle
      var circleCenter = this.mapData.layers.filter(
        (x) => x.type == "circle"
      )[0].points[0];
      // center
      var center = { lat: circleCenter.lat, lng: circleCenter.lng };
      // radius
      var radius = this.mapData.layers.filter((x) => x.type == "circle")[0]
        .radius;

      var isInsideOfCircle = this.isPointInCircle(
        center.lat,
        center.lng,
        point.lat,
        point.lng,
        radius
      );

      console.log(isInsideOfCircle);

      if (!isInsideOfPolygon && !isInsideOfCircle) {
        this.singleMarker.setLatLng([
          Number(prePoint.lat),
          Number(prePoint.lng),
        ]);
        this.snackbar = true;
      }
    },

    isPointInCircle(centerLat, centerLng, pointLat, pointLng, radius) {
      var distance = this.distance(centerLat, centerLng, pointLat, pointLng);
      distance = distance * 1000.0;
      return distance <= radius;
    },

    distance(centerLat, centerLng, pointLat, pointLng) {
      var distance = this.haversine(centerLat, centerLng, pointLat, pointLng);
      return distance;
    },

    degreesToRadians(degrees) {
      return (degrees * Math.PI) / 180.0;
    },

    haversine(centerLat, centerLng, pointLat, pointLng) {
      var earthRadiusKm = 6371.0; // Radius of the Earth in km
      var dLat = this.degreesToRadians(pointLat - centerLat);
      var dLng = this.degreesToRadians(pointLng - centerLng);
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.degreesToRadians(centerLat)) *
          Math.cos(this.degreesToRadians(pointLat)) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return earthRadiusKm * c;
    },
  },
};
</script>

<style scoped>
#mapContainer {
  width: 100vw;
  height: 100vh;
}
</style>
