function main(config) {

  // =========================
  // 清理节点
  // =========================

  if (!config.proxies) return config;

  // 删除名称含 ":" 或 "：" 的节点
  config.proxies = config.proxies.filter(
    p => !/[：:]/.test(p.name)
  );

  const names = config.proxies.map(
    p => p.name
  );


  // =========================
  // 创建地区节点列表
  // =========================

  const regions = {
    "香港节点": /(香港|hk|hong\s*kong)/i,
    "台湾节点": /(台湾|Taiwan|TW\d*)/i,
    "新加坡节点": /(新加坡|sg|singapore)/i,
    "日本节点": /(日本|jp|japan)/i,
    "韩国节点": /(韩国|kr|korea)/i,
    "美国节点": /(美国|us|usa|united\s*states|america)/i
  };


  const regionNodes = {};

  for (const [region, regex] of Object.entries(regions)) {

    const nodes = names.filter(
      n => regex.test(n)
    );

    if (nodes.length) {
      regionNodes[region] = nodes;
    }

  }


  // =========================
  // 清理原代理组
  // =========================

  config["proxy-groups"] = config["proxy-groups"] || [];
  const groups = config["proxy-groups"];

  groups.forEach(group => {
    if (group.proxies) {
      group.proxies = group.proxies.filter(
        p => !/[：:]/.test(p)
      );
    }
  });


  // =========================
  // 手动选择组
  // =========================

  const serviceGroups = {

    "Youtube": [
      "自动选择",
      "香港节点",
      "新加坡节点",
      "台湾节点",
      "日本节点",
      "美国节点",
      "韩国节点"
    ],

    "巴哈姆特": [
      "台湾节点",
      "香港节点",
      "自动选择"
    ],

    "人工智能": [
      "台湾节点",
      "美国节点",
      "自动选择"
    ],

    "数字货币": [
      "台湾节点",
      "自动选择"
    ]

  };


  for (const [name, proxies] of Object.entries(serviceGroups)) {
    groups.push({
      name,
      type: "select",
      proxies
    });
  }


  // =========================
  // 自动选择地区节点
  // =========================

  for (const [region, nodes] of Object.entries(regionNodes)) {
    groups.push({
      name: region,
      type: "url-test",
      url: "https://www.gstatic.com/generate_204",
      interval: 300,
      tolerance: 50,
      proxies: nodes
    });
  }


  // =========================
  // 规则置顶
  // =========================

  config.rules = config.rules || [];
  const rules = [
    "GEOSITE,youtube,Youtube",
    "GEOSITE,bahamut,巴哈姆特",
    "GEOSITE,category-ai-!cn,人工智能",
    "GEOSITE,category-cryptocurrency,数字货币"
  ];


  config.rules = [

    ...rules.filter(
      r => !config.rules.includes(r)
    ),

    ...config.rules

  ];

  return config;
}