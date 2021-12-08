project_root=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
project_folder="$project_root"/testsuite

hise_path="$project_root"/HISE.app/Contents/MacOS/HISE

echo "Project Folder: " $project_folder

"$hise_path" set_project_folder "-p:$project_folder"
"$hise_path" compile_networks -c:CI

"$project_folder"/DspNetworks/Binaries/batchCompileOSX

"$hise_path" load -p:XmlPresetBackups/TestSuite.xml