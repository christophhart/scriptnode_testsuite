namespace CableTableTest
{
	const var n = TestFramework.reset("cable_table_test", {
		FactoryPath: "container.chain", ID: "myId",
		Nodes: [
		{ FactoryPath: "control.cable_table", ID: "table"},
		{ FactoryPath: "math.add", ID: "add"}
		]
	},
	{"table.Value": 0.25});
	
	TestFramework.connectSingle("table", 0, "add", "Value");
	
	const var pointValue = 0.4;
	
	const var td  = TestFramework.setTableData("table", [[0.0, 1.0, 0.5], [0.25, pointValue, 0.5], [1.0, 1.0, 0.5]]);
	
	const var index = td.getCurrentlyDisplayedIndex();
	TestFramework.assertSimilar(index, 0.25, "index not the same: " + index);
	
	const var t = TestFramework.createTest(TestData.Empty512);
	
	reg r = TestFramework.run();
	
	TestFramework.assertSimilar(pointValue, r[0], "y-value at mid point doesn't match: " + r[0]);
	
	td.setTablePoint(1, 0.25, 0.75, 0.5);
	
	reg r2 = TestFramework.run();
	
	TestFramework.assertSimilar(0.75, r2[0], "y-value after table point change doesn't match: " + r2[0]);
	
	TestFramework.flush();
	
}