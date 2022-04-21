import * as fs from "fs"

const HARDHAT_TEST_CHAINID = 31337;

// Save the deployment to a local JSON file. The client uses this information.
export function logDeployment(chainId: number, address: string) {
  const addressDirectory = 'addresses'
  const addressFile = 'published-addresses.json'
  let filePath = addressDirectory + '/' + addressFile

  // Don't modify when Hardhat tests are ran
  if (chainId == HARDHAT_TEST_CHAINID) {
    return;
  }

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

// Return the saved address for a given chain
export function getDeployment(chainId: number): string {
  const addressDirectory = 'addresses'
  const addressFile = 'published-addresses.json'
  let filePath = addressDirectory + '/' + addressFile

  let chainIdKey = chainId.toString()

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

  if (chainIdKey in addressData) {
    return addressData[chainIdKey]
  } else {
    return "No published deployment";
  }
}