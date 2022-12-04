const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.001"),
  });
  await waveContract.deployed();

  console.log(`Contract deployed to ${waveContract.address}`);
  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();
  console.log(`Deploying contracts with account ${deployer.address}`);
  console.log(`Account balance ${accountBalance}`);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0); // exit without error
  } catch (error) {
    console.log(error);
    process.exit(1); // exit with error
  }
};

runMain();
