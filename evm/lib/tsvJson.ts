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
  let str = `${Object.keys(array[0]).map(value => `${value}`).join("\t")}` + '\r\n';

  return array.reduce((str: string, next: number) => {
      str += `${Object.values(next).map(value => `${value}`).join("\t")}` + '\r\n';
      return str;
     }, str);
}