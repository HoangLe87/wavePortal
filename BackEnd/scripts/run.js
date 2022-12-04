const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();
  console.log("Contract address:", waveContract.address);

  let waveCount;
  waveCount = await waveContract.getTotalWaves();
  console.log(`${waveCount}`);

  let waveTxn = await waveContract.wave("Message1!");
  await waveTxn.wait(); // Wait for the transaction to be mined

  const [_, randomPerson] = await hre.ethers.getSigners();
  waveTxn = await waveContract.connect(randomPerson).wave("Message2!");
  await waveTxn.wait();

  let allWaves = await waveContract.getAllWaves();
  console.log(allWaves);
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
