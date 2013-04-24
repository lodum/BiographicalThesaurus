import java.io.*;
/**
usage java LineExtractor <filename>
Extracts all GND URL from the lobid dump
*/
public class LineExtractor {
	public static void main(String args[]) {
		try {
			// Open the file that is the first
			// command line parameter
			FileInputStream fstream = new FileInputStream((String) args[0]);
			// Get the object of DataInputStream
			DataInputStream in = new DataInputStream(fstream);
			BufferedReader br = new BufferedReader(new InputStreamReader(in));
			String strLine;

			FileWriter outStream = new FileWriter("out.txt");
			BufferedWriter out = new BufferedWriter(outStream);

			// Read File Line By Line
			while ((strLine = br.readLine()) != null) {
				if (strLine.contains("http://d-nb.info/gnd")) {
					try {
						String gnd = strLine.substring(strLine.indexOf("http://d-nb.info/gnd/"), strLine.indexOf(">", strLine.indexOf("http://d-nb.info/gnd/")));
						String filename = gnd.substring(21);
						//out.write(gnd + "/about/" + filename + ".rdf\n");
						out.write(gnd + "/about/" + "rdf\n");
					} catch (Exception e) {// Catch exception if any
						System.err.println("Error: " + e.getMessage());
					}
				}
			}
			out.close();
			// Close the input stream
			in.close();
		} catch (Exception e) {// Catch exception if any
			System.err.println("Error: " + e.getMessage());
		}
	}
}