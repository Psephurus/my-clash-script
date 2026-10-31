function main(config) {
  const proxies = config["proxy-groups"].find(g => g.name === "Proxy").proxies;
  config["proxy-groups"].push({ name: "Bilibili", type: "select", proxies });
  config.rules.unshift("GEOSITE,bilibili,Bilibili");
  return config;
}