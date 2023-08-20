// Attribution: https://gist.github.com/iwek/7154706?permalink_comment_id=2890480#gistcomment-2890480
export function tsvToJson(tsv: string) {
  const lines = tsv.split('\n');
  return lines.map(line => {
    const data = line.replace(/\r/g, '').split('\t');
    return data;
  });
}

// Includes headers
export function jsonToTsv(objArray: Array<Object>) {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
  let str = jsonToTsvLine(array[0]);

  return array.reduce((str: string, next: string) => {
      return str += jsonToTsvLine(next);
    }, 
    str);
}

export function jsonToTsvLine(object: Object) {
  return `${Object.values(object).map(value => `${value}`).join("\t")}` + '\r\n';
}