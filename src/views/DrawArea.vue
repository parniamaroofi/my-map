<template>
  <div>
    <div id="mapDrawContainer"></div>

    <v-dialog v-model="detailsDialog" width="550">
      <v-card class="pa-5 rounded-xl" dir="ltr">
        <v-card-title style="font-size: 1.5rem">Details</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <div v-if="!latlng[0].lat">
            <div class="mb-5" style="font-size: 1.5rem">
              <b class="text-info">Total points: </b>
              <span>{{ latlng[0].length }}</span>
            </div>
            <div class="mb-3" style="font-size: 1.2rem">
              <b>
                <v-icon size="small" class="mr-2">mdi-flare</v-icon>Layer type:
              </b>
              <span>{{ layerType }}</span>
            </div>
            <div v-for="(item, index) in latlng[0]" :key="index" class="mb-2">
              <b>Point {{ index + 1 }}: </b>
              <span>{{ item.lat }}, {{ item.lng }}</span>
            </div>
          </div>

          <div v-else>
            <div class="mb-5" style="font-size: 1.5rem">
              <b class="text-info">Total points: </b>
              <span>{{ latlng.length }}</span>
            </div>
            <div class="mb-3" style="font-size: 1.2rem">
              <b>
                <v-icon size="small" class="mr-2">mdi-flare</v-icon>Layer type:
              </b>
              <span>{{ layerType }}</span>
            </div>
            <div v-for="(item, index) in latlng" :key="index" class="mb-2">
              <b>Point {{ index + 1 }}: </b>
              <span>{{ item.lat }}, {{ item.lng }}</span>
            </div>
            <div v-if="layerType == 'circle'">
              <b>Radius: </b>
              <span>{{ Math.round(circleRadius) }}m</span>
            </div>
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
  </div>
</template>

<script>
import "/public/Tween.js";
import "leaflet/dist/leaflet.css";
import "/public/leaflet.curve.js";
import "leaflet-draw/dist/leaflet.draw.css";
import { ref } from "vue";
export default {
  name: "VueMapDrawArea",

  setup() {
    const latlng = ref([]);
    const layerType = ref("");
    const isDone = ref(false);
    const circleRadius = ref(null);
    const detailsDialog = ref(false);

    return {
      latlng,
      isDone,
      layerType,
      circleRadius,
      detailsDialog,
    };
  },

  beforeRouteLeave(to, from, next) {
    console.log(to.path);
    if (to.path == "/") {
      window.location.replace("/");
    } else {
      next();
    }
  },

  mounted() {
    var map = L.map("mapDrawContainer").setView(
      [35.79378606761215, 51.43173310495744],
      18
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    var drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    var drawControl = new L.Control.Draw({
      draw: {
        line: true,
        polygon: true,
        polyline: true,
        rectangle: true,
        circle: true,
        marker: true,
        circlemarker: false,
      },
      edit: {
        edit: false,
        featureGroup: drawnItems,
      },
    });

    L.drawLocal.draw.toolbar.actions.title = "لغو ترسیم";
    L.drawLocal.draw.toolbar.actions.text = "لغو";
    L.drawLocal.draw.toolbar.finish.title = "اتمام ترسیم";
    L.drawLocal.draw.toolbar.finish.text = "اتمام";
    L.drawLocal.draw.toolbar.undo.title = "حذف آخرین نقطه ترسم شده";
    L.drawLocal.draw.toolbar.undo.text = "حذف آخرین نقطه";
    L.drawLocal.draw.toolbar.undo.title = "حذف آخرین نقطه ترسم شده";
    L.drawLocal.draw.toolbar.undo.text = "حذف آخرین نقطه";

    L.drawLocal.edit.toolbar.actions.save.title = "ذخیره‌سازی تغییرات";
    L.drawLocal.edit.toolbar.actions.save.text = "ذخیره‌سازی";
    L.drawLocal.edit.toolbar.actions.cancel.title = "لغو حذف";
    L.drawLocal.edit.toolbar.actions.cancel.text = "لغو";
    L.drawLocal.edit.toolbar.actions.clearAll.title = "حذف همه لایه‌ها";
    L.drawLocal.edit.toolbar.actions.clearAll.text = "حذف همه";

    L.drawLocal.draw.handlers.polyline.tooltip.start =
      "برای شروع رسم چندخطی کلیک کنید...";
    L.drawLocal.draw.handlers.polyline.tooltip.cont =
      "برای ادامه رسم چندخطی کلیک کنید...";
    L.drawLocal.draw.handlers.polyline.tooltip.end =
      "برای اتمام رسم چندخطی کلیک کنید...";

    L.drawLocal.draw.handlers.polygon.tooltip.start =
      "برای شروع رسم چندضلعی کلیک کنید...";
    L.drawLocal.draw.handlers.polygon.tooltip.cont =
      "برای ادامه رسم چندضلعی کلیک کنید...";
    L.drawLocal.draw.handlers.polygon.tooltip.end =
      "برای اتمام رسم چندضلعی کلیک کنید...";

    L.drawLocal.draw.handlers.rectangle.tooltip.start =
      "برای شروع رسم مستطیل کلیک کنید...";
    L.drawLocal.draw.handlers.rectangle.tooltip.end =
      "برای اتمام رسم مستطیل کلیک را رها کنید...";

    L.drawLocal.draw.handlers.circle.tooltip.start =
      "برای شروع رسم دایره کلیک کنید...";
    L.drawLocal.draw.handlers.circle.tooltip.end =
      "برای اتمام رسم دایره کلیک را رها کنید...";

    L.drawLocal.draw.handlers.marker.tooltip.start =
      "برای جای‌گذاری نشان‌گذار کلیک کنید...";

    L.drawLocal.edit.handlers.remove.tooltip.text =
      "برای حذف لایه، بر روی آن کلیک کنید...";

    L.drawLocal.draw.toolbar.buttons.polyline = "رسم چندخطی";
    L.drawLocal.draw.toolbar.buttons.polygon = "رسم چندضلعی";
    L.drawLocal.draw.toolbar.buttons.rectangle = "رسم مستطیل";
    L.drawLocal.draw.toolbar.buttons.circle = "رسم دایره";
    L.drawLocal.draw.toolbar.buttons.marker = "رسم نشان‌گذار";

    L.drawLocal.edit.toolbar.buttons.remove = "حذف";
    L.drawLocal.edit.toolbar.buttons.removeDisabled =
      "لایه‌ای برای حذف وجود ندارد";

    map.addControl(drawControl);

    map.on("draw:created", function (event) {
      var layer = event.layer;
      drawnItems.addLayer(layer);

      layer.on("click", function () {
        getLatlngs(layer, event);
      });

      getLatlngs(layer, event);
    });

    const getLatlngs = (layer, data) => {
      this.layerType = data.layerType;
      if (this.layerType == "circle") {
        this.circleRadius = data.layer._mRadius;
      }
      this.latlng = getLatLngsFromLayer(layer);
      this.detailsDialog = true;
    };

    function getLatLngsFromLayer(layer) {
      if (layer instanceof L.Marker) {
        // For markers, return a single latlng
        return [layer.getLatLng()];
      } else if (
        layer instanceof L.Polygon ||
        layer instanceof L.Polyline ||
        layer instanceof L.Rectangle
      ) {
        // For polygons, polylines, and rectangles, return an array of latlngs
        return layer.getLatLngs();
      } else if (layer instanceof L.Circle) {
        // For circles, return the center latlng
        return [layer.getLatLng()];
      } else {
        // Handle other types of layers as needed
        return [];
      }
    }
  },

  methods: {},
};
</script>

<style lang="scss">
#mapDrawContainer {
  width: 100vw;
  height: 100vh;
}

@font-face {
  font-family: Yekan;
  src: url("@/assets/fonts/YekanBakhFaNum-Regular.ttf");
}

.leaflet-draw-actions {
  a {
    font-family: Yekan;
  }

  * {
    border-radius: 5px !important;
  }

  li {
    margin-right: 1px;
  }
}
.leaflet-bar {
  border: 1px solid #ccc !important;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px !important;
}
</style>
