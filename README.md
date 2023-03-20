To recompile the contracts, clear out the compiled/abi and compiled/bin

and run the following from inside the contracts folder

npx solc --bin _.sol -o ./compiled/bin

npx solc --abi _.sol -o ./compiled/abi

To deploy a contract, just change the name passed to deployContract at the bottom of src/deploy.ts
