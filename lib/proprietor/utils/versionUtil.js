
/**
 * @description 版本比较
 * 0: 相等 1:版本大于线上版本 -1:小于线上版本
**/
export function compareVersions(v1, v2) {
  var v1parts = v1.split('.');
  var v2parts = v2.split('.');
  
  for (var i = 0; i < v1parts.length; ++i) {
    if (v2parts.length == i) {
      return 1;
    }
    
    if (v1parts[i] == v2parts[i]) {
      continue;
    }
    else if (v1parts[i] > v2parts[i]) {
      return 1;
    }
    else {
      return -1;
    }
  }
  
  if (v1parts.length != v2parts.length) {
    return -1;
  }
  
  return 0;
}

