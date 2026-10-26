document.addEventListener("DOMContentLoaded",() =>{
    const s= window.Storage.getSettings();
    if(s){
       document.getElementById("cfgMaxCar").value = s.maxFareCarPerKm || 8000;
        document.getElementById("cfgMaxRadius").value = s.maxDetourRadiusKm || 2.5;
        document.getElementById("cfgMinTrust").value = s.minTrustScoreToShare || 80;
        document.getElementById("cfgAiRoute").value = s.aiWeightRouteMatch || 50;
        document.getElementById("cfgAiTime").value = s.aiWeightTimeDelta || 30;
        document.getElementById("cfgAiRating").value = s.aiWeightDriverRating || 20;
        document.getElementById("cfgPlatformStatus").value = s.platformStatus || "operational";
      }
    });
    function savePlatformSettings(e) {
      e.preventDefault();

      const routeW = parseInt(document.getElementById("cfgAiRoute").value) || 50;
      const timeW = parseInt(document.getElementById("cfgAiTime").value) || 30;
      const rateW = parseInt(document.getElementById("cfgAiRating").value) || 20;

      if (routeW + timeW + rateW !== 100) {
        window.Toast.show(`Tổng 3 trọng số AI hiện tại là ${routeW + timeW + rateW}%, phải bằng đúng 100%!`, "error");
        return;
      }

      const newSettings = {
        maxFarePerKm: window.Storage.getSettings().maxFarePerKm || 3500,
        maxFareCarPerKm: parseInt(document.getElementById("cfgMaxCar").value) || 8000,
        maxDetourRadiusKm: parseFloat(document.getElementById("cfgMaxRadius").value) || 2.5,
        minTrustScoreToShare: parseInt(document.getElementById("cfgMinTrust").value) || 80,
        aiWeightRouteMatch: routeW,
        aiWeightTimeDelta: timeW,
        aiWeightDriverRating: rateW,
        platformStatus: document.getElementById("cfgPlatformStatus").value
      };

      window.Storage.saveSettings(newSettings);
      window.Toast.show("Đã lưu các tham số nền tảng thành công!", "success");
    }