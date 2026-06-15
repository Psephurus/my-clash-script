function main(config) {
  const names = config.proxies.map(p => p.name);

  // AI台湾
  const aiTwNodes = names.filter(
    n => /(?=.*(AI|GPT))(?=.*(台湾|TW))/i.test(n)
  );

  // 流媒体台湾
  const streamTwNodes = names.filter(
    n => /(?=.*流媒体)(?=.*台湾)/i.test(n)
  );

  // 香港节点
  const hkNodes = names.filter(
    n => /香港/i.test(n)
  );

  // AI台湾
  config["proxy-groups"].push({
    name: "AI台湾",
    type: "url-test",
    url: "http://www.gstatic.com/generate_204",
    interval: 300,
    proxies: aiTwNodes.length ? aiTwNodes : ["DIRECT"]
  });

  // 流媒体台湾
  config["proxy-groups"].push({
    name: "流媒体台湾",
    type: "url-test",
    url: "http://www.gstatic.com/generate_204",
    interval: 300,
    proxies: streamTwNodes.length ? streamTwNodes : ["DIRECT"]
  });

  // 巴哈姆特
  config["proxy-groups"].push({
    name: "巴哈姆特",
    type: "select",
    proxies: ["流媒体台湾", ...names]
  });

  // 香港节点
  config["proxy-groups"].push({
    name: "香港节点",
    type: "url-test",
    url: "http://www.gstatic.com/generate_204",
    interval: 300,
    proxies: hkNodes.length ? hkNodes : ["DIRECT"]
  });

  // Youtube
  config["proxy-groups"].push({
    name: "Youtube",
    type: "select",
    proxies: ["香港节点", ...names]
  });

  // 规则置顶
  config.rules.unshift(
    "GEOSITE,youtube,Youtube",
    "GEOSITE,category-ai-!cn,AI台湾",
    "GEOSITE,category-cryptocurrency,AI台湾",
    "GEOSITE,bahamut,巴哈姆特",
    "GEOSITE,category-finance,AI台湾"
  );

  return config;
}