function main(config) {
  const names = config.proxies.map(p => p.name);


  // 删除代理组中名称含 ":" 或 "：" 的节点
  config["proxy-groups"].forEach(group => {
    group.proxies = group.proxies?.filter(p => !/[：:]/.test(p));
  });


  // 新建代理组规则
  // AI台湾
  const aiTwNodes = names.filter(
    n => /(?=.*(AI|GPT|都))(?=.*(台湾|TW))/i.test(n)
  );

  // 台湾流媒体
  const streamTwNodes = names.filter(
    n => /(?=.*流媒体)(?=.*台湾)/i.test(n)
  );

  // 香港流媒体
  const streamHkNodes = names.filter(
    n => /(?=.*流媒体)(?=.*香港)/i.test(n)
  );

  // 香港节点
  const hkNodes = names.filter(
    n => /香港/i.test(n)
  );


  // 插入代理组规则
  // AI台湾
  config["proxy-groups"].push({
    name: "AI台湾",
    type: "url-test",
    url: "http://www.gstatic.com/generate_204",
    interval: 300,
    proxies: aiTwNodes.length ? aiTwNodes : ["DIRECT"]
  });

  // 台湾流媒体
  config["proxy-groups"].push({
    name: "台湾流媒体",
    type: "url-test",
    url: "http://www.gstatic.com/generate_204",
    interval: 300,
    proxies: streamTwNodes.length ? streamTwNodes : ["DIRECT"]
  });

  // 香港流媒体
  config["proxy-groups"].push({
    name: "香港流媒体",
    type: "url-test",
    url: "http://www.gstatic.com/generate_204",
    interval: 300,
    proxies: streamHkNodes.length ? streamHkNodes : ["DIRECT"]
  });

  // Youtube
  config["proxy-groups"].push({
    name: "Youtube",
    type: "select",
    proxies: ["香港节点", "自动选择"]
  });

  // 巴哈姆特
  config["proxy-groups"].push({
    name: "巴哈姆特",
    type: "select",
    proxies: ["台湾流媒体", "香港流媒体", "自动选择"]
  });

  // 香港节点
  config["proxy-groups"].push({
    name: "香港节点",
    type: "url-test",
    url: "http://www.gstatic.com/generate_204",
    interval: 300,
    proxies: hkNodes.length ? hkNodes : ["DIRECT"]
  });

  
  // 规则置顶
  config.rules.unshift(
    "GEOSITE,youtube,Youtube",
    "GEOSITE,category-ai-!cn,AI台湾",
    "GEOSITE,category-cryptocurrency,AI台湾",
    "GEOSITE,bahamut,巴哈姆特",
    "GEOSITE,category-finance,AI台湾",
    "GEOSITE,category-netdisk-!cn,自动选择"
  );

  return config;
}