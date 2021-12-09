namespace FileCreators
{
	inline function createFileIfNoExist(name, data)
	{
		local af = FileSystem.getFolder(FileSystem.AudioFiles).getChildFile(name);
		
		if(!af.isFile())
		{
			af.writeAudioFile(data, 44100.0, 24);
			Console.print("Created file " + af.toString(0));
			return true;
		}
		
		return false;
	}
	
	const var b = Buffer.create(1024);
	b[0] = 1.0;
	
	createFileIfNoExist("one_dirac.wav", b);
		
	b[0] = 0.0;
	b[512] = 1.0;
	
	createFileIfNoExist("one_dirac_delayed.wav", b);
}