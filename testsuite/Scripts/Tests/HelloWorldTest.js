// This is a simple hello world example that
// demonstrates the usage of the testing framework.
namespace HelloWorldTest
{
	// Creates a network with the given signal tree and parameter values
	const var n = TestFramework.reset("hello_world", 
	{ FactoryPath: "math.add", ID: "add1" }, 
	{ "add1.Value": 0.82 });
	
	// Creates a test object with an empty 512 sample buffer
	TestFramework.createTest(TestData.Empty512);
	
	// This simply runs the test twice, and compares the output to make sure
	// that the test setup leads to predictable results.
	TestFramework.assertConsistency();
	
	// run the test
	const var run1 = TestFramework.run();
	
	// this checks whether the value in the middle of the buffer
	// was set correctly by the add node (changet the number below to see how
	// an error looks like)
	TestFramework.assertEquals(run1[256], 0.82, "1. add value doesn't work");
	
	// Let's change the parameter
	n.setParameterDataFromJSON({ "add1.Value": 0.58 });
	
	// run the test again
	const var run2 = TestFramework.run();
	
	// check the test result again
	TestFramework.assertEquals(run2[256], 0.58, "2. add value doesn't work");
	
	// This cleans the test framework state and prints the statistic
	TestFramework.flush();
}