(function () {
  const cfg = window.APEX_CONFIG || {};

  const brandUrl = cfg.brandUrl || "https://raw.githubusercontent.com/ESA-APEx/apex_project_branding/refs/heads/main/default.css";

  console.log("apex-brand-loader: loading brand CSS from", brandUrl);
  if (brandUrl) {
    fetch(brandUrl)
      .then(function (resp) {
        if (!resp.ok) throw new Error("Brand CSS fetch failed: " + resp.status);
        return resp.text();
      })
      .then(function (css) {
        const style = document.createElement("style");
        style.textContent = css;
        document.head.appendChild(style);
      })
      .catch(function (err) {
        console.warn("apex-brand-loader: could not load brand CSS", err);
      });
  }
})();