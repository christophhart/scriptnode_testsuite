namespace TempoSyncTest
{
	const var n = TestFramework.reset("tempo_sync", 
	{
		FactoryPath: "container.chain", Nodes: [
		{ FactoryPath: "control.tempo_sync", ID: "tempo" },
		{ FactoryPath: "core.ramp", ID: "ramp" }
		]
	}, 
	{
		"tempo.Tempo": 12,
		"tempo.Enabled": 1
	});
	
	
	TestFramework.connectSingle("tempo", 0, "ramp", "PeriodTime");
	
	TestFramework.createTest(TestData.Empty8192);
	
	
	Engine.setHostBpm(54);
	
	
	const var tmp = n.get("tempo");
	
	const var slow = TestFramework.run();
	
	Engine.setHostBpm(54 * 2);
	
	const var fast = TestFramework.run();
	
	TestFramework.assertConsistency();
	
	
	TestFramework.assertNotEmpty(slow, "ramp doesn't work");
	TestFramework.assertSimilar(slow[4096], 0.5, "slow half value mismatch");
	TestFramework.assertSimilar(fast[4096], 0.0, "fast half value mismatch");
	TestFramework.assertSimilar(fast[2048], 0.5, "fast quarter value mismatch");
	
	
	TestFramework.assertEquals(slow[50], fast[25], "value mismatch");
	
	TestFramework.flush();
}