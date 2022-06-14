import * as fs from "fs"

// Local addresses change every time test are ran, so store in a .gitignored file
// And keep public addresses in a VCS tracked file.
const LOCAL_CHAINS = {
  ganache: 1337,
  hardhat: 31337,
}

function getAddressesFile(chainId: string|number) {
  if (Object.values(LOCAL_CHAINS).includes(Number(chainId))) {
    return 'local-addresses.json';
  } else {
    return 'published-addresses.json';
  }
}

// Save the deployment to a local JSON file. The client uses this information.
export function logDeployment(chainId: number, address: string) {
  const addressDirectory = 'addresses';
  let filePath = addressDirectory + '/' + getAddressesFile(chainId);

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
export function getDeployment(chainId?: number): string {
  if (chainId === undefined) {
    throw("Error: ChainId is not set for the selected network.");
  }
  
  const addressDirectory = 'addresses';
  let filePath = addressDirectory + '/' + getAddressesFile(chainId);

  let chainIdKey = chainId.toString();

  //ensure the directory exists
  if (!fs.existsSync(addressDirectory)){
    fs.mkdirSync(addressDirectory);
  }

  //load existing data
  let addressData: {[key: string]: string} = {}
  if (fs.existsSync(filePath)){
    let data = fs.readFileSync(filePath, {encoding:'utf8', flag:'r'});
    addressData = JSON.parse(data);
  }

  if (chainIdKey in addressData) {
    return addressData[chainIdKey];
  } else {
    return "No published deployment";
  }
}