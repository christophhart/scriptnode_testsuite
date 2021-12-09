namespace SendRuntimeTest
{
	inline function testRuntimeBypass(containerType, exceptionType)
	{
		local n = TestFramework.reset("runtime_bypass::" + containerType, 
		{
			FactoryPath: "container.chain", ID: "chain", Nodes: [
			  {
				  FactoryPath: "container." + containerType, ID: "rcontainer", Nodes: 
				  [{ FactoryPath: "routing.receive", ID: "receive" }]
			  },
			  {
				  FactoryPath: "container.chain", ID: "scontainer", Nodes:
				  [{ FactoryPath: "routing.send", ID: "send" }]
			  }
			 
			]
		}, 
		{
			"receive.Feedback": 0.5
		});
		
		
		n.get("send").set("Connection", "receive");
		n.get("rcontainer").set("Bypassed", true);
		
		local t = TestFramework.createTest(TestData.Empty8192);
		
		
		local b = TestFramework.run();
		
		// If the oversampler is bypassed, we do not throw an exception.
		TestFramework.assertNoException();
		
		n.get("rcontainer").set("Bypassed", false);
		
		TestFramework.run();
		
		TestFramework.assertExceptionContains(exceptionType, containerType);
		
		n.get("rcontainer").set("Bypassed", true);
		
		// Now we add a function that simulates the user clicking the bypass button mid-run
		t.addRuntimeFunction(function()
		{
			this.get("rcontainer").set("Bypassed", false);
		}, 1024);
		
		TestFramework.run();

		TestFramework.assertExceptionContains(exceptionType, containerType);
		
		TestFramework.flush();
	}

	
	testRuntimeBypass("oversample2x", "Samplerate");
	testRuntimeBypass("chain", "");
	testRuntimeBypass("midichain", "");
	testRuntimeBypass("fix32_block", "Blocksize");
	testRuntimeBypass("fix_blockx", "Blocksize");
	testRuntimeBypass("frame1_block", "Blocksize");
	testRuntimeBypass("framex_block", "Blocksize");
	testRuntimeBypass("split", "");
	testRuntimeBypass("multi", "");
}
