package wwu.stis;

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import com.hp.hpl.jena.rdf.model.*;
import com.hp.hpl.jena.util.FileManager;

import java.io.*;

/** Tutorial 5 - read RDF XML from a file and write it to standard out
 *
 * @author  bwm - updated by kers/Daniel
 * @version Release='$Name: not supported by cvs2svn $' Revision='$Revision: 1.4 $' Date='$Date: 2006-04-27 09:30:07 $'
 */
public class Converter extends Object {

    /**
        NOTE that the file is loaded from the class-path and so requires that
        the data-directory, as well as the directory containing the compiled
        class, must be added to the class-path when running this and
        subsequent examples.
     * @throws IOException 
    */ 

	public void parseTurtle() throws IOException{
		 FileManager.get().addLocatorClassLoader(Converter.class.getClassLoader());
	        InputStream in = FileManager.get().open("turtle.ttl");
	        BufferedReader reader = new BufferedReader(new InputStreamReader(in));
	        String line = null;
	        Model all = ModelFactory.createDefaultModel();
	        while ( ( line = reader.readLine() ) != null ) {
	        	ByteArrayInputStream bais = new ByteArrayInputStream(line.getBytes());
	        	Model model = ModelFactory.createDefaultModel();
	        	model.read(bais, null, "TURTLE");
	        	model.write(System.out, "TURTLE");
	        	all.add(model);
	        	all.setNsPrefixes(model.getNsPrefixMap());
	        	System.out.println("----------------");
	        }
	        
	        
	        
	        //all.write(System.out, "TURTLE");
	}
	
	

                              
    public static void main (String args[]) {
           Converter conv = new Converter();
           try {
			conv.parseTurtle();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }
}
