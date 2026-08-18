import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_PUBLISHABLE_KEY!
);

async function main() {
  console.log("Checking secondary trades...");
  const { data, error } = await supabase.from('secondary_trades').select('*');
  if (error) {
    console.error("Error fetching trades:", error);
  } else {
    console.log(`Found ${data.length} secondary trades.`);
    if (data.length > 0) {
      console.log(data[0]);
    }
  }

  console.log("\nChecking investments for secondary flags...");
  const { data: invs, error: iErr } = await supabase.from('investments').select('*').limit(5);
  if (iErr) {
    console.error("Error fetching investments:", iErr);
  } else {
    console.log("Investment keys:", Object.keys(invs[0] || {}));
  }
}

main();
