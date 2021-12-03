# Scriptnode Testsuite

## Styleguide

This repository is open to contributions. In order to keep things consistent, please stick to the following guidelines when you submit a pull request:

- one network test per script file with the same descriptive name as the test name you're about to create
- You can run multiple tests for a network in the same file
- 

## Cheatsheet

### Create a DSP network for testing

Use `TestFramework.reset()` in order to create a new DspNetwork that you want to test.
You can supply two JSON objects, one describing the layout and one with non-default parameters.

```
const var n = TestFramework.reset("testname", {
	FactoryPath: "container.chain", ID: "myId",
	Nodes: [
	{ FactoryPath: "core.gain", ID: "gain"}
	]
},
{
	"gain.Smoothing": 20.0
});
```

> The ID parameter is optional, but if you want to access it for setting the parameters or any other method, you will need to supply an ID or it will generate a random unique name that might be hard to guess right.

### Create a test and run it

```
const var t = TestFramework.createTest(TestData.Empty512);

const var result = t.runTest();
```

> Take a look at the [TestData file](https://github.com/christoph-hart/scriptnode_testsuite/blob/master/testsuite/Scripts/Framework/TestData.js) for a list of readymade JSON objects that you want to use as test signal

### Check the result

Use the `TestFramework.assertXXX` functions in conjunction with a meaningful error message that will be logged if the test fails

```
Check that the result is not empty
TestFramework.assertNotEmpty(result, "is empty")

// Check against a number
TestFramework.assertEquals(result[0], 0.5, "not 0.5");

// run it again (after you changed something)
const var result2 = t.runTest(); 

// Check that both results are equal
TestFramework.assertEquals(result, result2);
```

### Save a reference file:

You can save the test result to a audio file and compare each subsequent run against the test file:

```
TestFramework.equalsReferenceFile(result);
```

> If the file doesn't exist, it will just save the current output there. This will create an audio file in the AudioFiles test directory called "networkName.wav".

### Clean up

This prints a statistic at the end for all tests that have been executed between calls to flush

```
TestFramework.flush()
```