const isIntStr = (numStr: string): boolean => {
  for (let i = 0; i < numStr.length; i++) {
    const current: string = numStr[i];
    if (
      current !== '0' &&
      current !== '1' &&
      current !== '2' &&
      current !== '3' &&
      current !== '4' &&
      current !== '5' &&
      current !== '6' &&
      current !== '7' &&
      current !== '8' &&
      current !== '9'
    ) {
      return false;
    }
  }
  return true;
};

const getKeys = (str: string): string[] => {
  const keys = [];
  let startIndex = -1;
  for (let i = 1; i < str.length; i ++) {
    if (str[i] === '[' && startIndex === -1) {
      startIndex = i;
    }
    if (str[i] === ']' && startIndex !== -1) {
      if (startIndex < i) {
        keys.push(str.slice(startIndex + 1, i));
        startIndex = -1;
      }
    }
  }
  return keys;
}

export const transform = (value: Record<string, any>): Record<string, any> => {
  if (!value) {
    return {};
  }

  const finalQueryParams: Record<string, any> = {};

  Object.keys(value).forEach(key => {
    let lastKey: string = key.slice(0, key.indexOf('['));
    const currentVal = value[key];

    if (!lastKey) {
      finalQueryParams[key] = currentVal;
      return;
    }

    const currentKeys = getKeys(key);

    if (!Array.isArray(currentKeys) || currentKeys.length === 0) {
      finalQueryParams[key] = currentVal;
      return;
    }

    let currentObj: Record<string, any> = finalQueryParams;

    currentKeys.forEach(item => {
      const isNumberKey = isIntStr(item);
      if (!currentObj[lastKey]) {
        currentObj[lastKey] = isNumberKey ? [] : {}
      }
      currentObj = currentObj[lastKey];
      lastKey = item;
    });
    currentObj[lastKey] = currentVal;
  });
  return finalQueryParams;
};
