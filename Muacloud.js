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
    regionNodes[region] = names.filter(
      n => regex.test(n)
    );
  }


  // =========================
  // 清理原代理组
  // =========================

  if (config["proxy-groups"]) {

    config["proxy-groups"].forEach(group => {

      if (group.proxies) {
        group.proxies = group.proxies.filter(
          p => !/[：:]/.test(p)
        );
      }

    });

  } else {

    config["proxy-groups"] = [];

  }


  const groups = config["proxy-groups"];


  // =========================
  // 手动选择组
  // =========================

  groups.push(
    {
      name: "Youtube",
      type: "select",
      proxies: [
        "香港节点",
        "台湾节点",
        "日本节点",
        "美国节点",
        "新加坡节点",
        "韩国节点",
        "自动选择"
      ]
    },

    {
      name: "巴哈姆特",
      type: "select",
      proxies: [
        "台湾节点",
        "香港节点",
        "自动选择"
      ]
    }
  );


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
      proxies: nodes.length ? nodes : ["DIRECT"]
    });

  }


  // =========================
  // 规则置顶
  // =========================

  config.rules = config.rules || [];

  config.rules.unshift(
    "GEOSITE,youtube,Youtube",
    "GEOSITE,bahamut,巴哈姆特",
    "GEOSITE,category-ai-!cn,台湾节点",
    "GEOSITE,category-cryptocurrency,台湾节点"
  );


  return config;
}