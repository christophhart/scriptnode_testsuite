
include("Framework/TestData.js");
include("Framework/TestFramework.js");
include("Framework/Utility.js");
include("Framework/FileCreators.js");

//Utility.rebuildIncludeFile();

Console.print("\n\n=====================| Running Node Tests |======================\n");

include("node_tests/includes.js");

Console.print("\n\n=====================| Running Special Tests |======================\n");

include("Tests/SplitMidiTest.js");
include("Tests/SendRuntimeTest.js");

Console.print("\n=====================| Running compile tests |=====================\n");

include("compile_tests.js");




Console.print("\n\n");







function prepareToPlay(sampleRate, blockSize)
{
	
}
 function processBlock(channels)
{
	
}
 function onControl(number, value)
{
	
}
 