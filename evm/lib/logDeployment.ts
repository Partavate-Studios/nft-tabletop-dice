import * as fs from "fs"

export function logDeployment(chainId: number, address: string) {
  const addressDirectory = 'addresses'
  const addressFile = 'published-addresses.json'
  let filePath = addressDirectory + '/' + addressFile

  //ensure the directory exists
  if (!fs.existsSync(addressDirectory)){
    fs.mkdirSync(addressDirectory);
  }

  //load existing data
  let addressData: {[key: string]: string} = {}
  if (fs.existsSync(filePath)){
    let data = fs.readFileSync(filePath, {encoding:'utf8', flag:'r'});
    addressData = JSON.parse(data)
  }

  //add data
  addressData[chainId.toString()] = address

  //write data
  fs.writeFileSync(filePath, JSON.stringify(addressData)+'\n')
}