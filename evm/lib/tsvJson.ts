// Attribution: https://gist.github.com/iwek/7154706?permalink_comment_id=2890480#gistcomment-2890480
export function tsvToJson(tsv: string) {
  const lines = tsv.split('\n');
  return lines.map(line => {
    const data = line.replace(/\r/g, '').split('\t');
    return data;
  });
}

export function jsonToTsv(jsonarray: Array<Array<string>>) {
  return jsonarray.map(entry => { 
    return Object.values(entry).join("\t");
  }).join("\n");
}