import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const P_KEY = process.env.P_KEY as string;
const alchemyUrl = process.env.ALCHEMYURLGOERLI as string;

const web3 = new Web3(new Web3.providers.HttpProvider(alchemyUrl));

async function deployContract(contractName: string): Promise<void> {
  const account = web3.eth.accounts.privateKeyToAccount(P_KEY);
  web3.eth.accounts.wallet.add(account);
  web3.eth.defaultAccount = account.address;

  const contractBaseName = contractName.replace('.sol', '');
  const abiPath = `./contracts/compiled/abi/${contractBaseName}_sol_${contractBaseName}.abi`;
  const binPath = `./contracts/compiled/bin/${contractBaseName}_sol_${contractBaseName}.bin`;

  const abiJson = fs.readFileSync(abiPath, 'utf-8');
  const bin = fs.readFileSync(binPath, 'utf-8');

  const abi: AbiItem[] = JSON.parse(abiJson);

  const contract = new web3.eth.Contract(abi);

  const gasPrice = await web3.eth.getGasPrice();

  const deployOptions = {
    data: '0x' + bin,
    arguments: [], // Add constructor arguments here if required
    gasPrice: gasPrice,
  };

  const gasEstimate = await contract.deploy(deployOptions).estimateGas();

  const deployment = contract.deploy(deployOptions).send({
    from: account.address,
    gas: gasEstimate,
  });

  deployment
    .on('transactionHash', (transactionHash) => {
      console.log(`Transaction hash: ${transactionHash}`);
    })
    .on('receipt', (receipt) => {
      console.log(`Contract address: ${receipt.contractAddress}`);
    })
    .on('error', (error) => {
      console.error(`Deployment error: ${error}`);
    });
}

// Example usage:
deployContract('Forwarder.sol').catch((error) => console.error(error));
