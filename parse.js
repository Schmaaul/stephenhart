const parser = require("fast-xml-parser");
const fs = require("fs");
const string = `
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<events>
  <event name="Staticpvptest_1">
    <nominal>1</nominal>
    <min>0</min>
    <max>0</max>
    <lifetime>300</lifetime>
    <restock>0</restock>
    <saferadius>0</saferadius>
    <distanceradius>0</distanceradius>
    <cleanupradius>0</cleanupradius>
    <flags deletable="0" init_random="0" remove_damaged="0"/>
    <position>fixed</position>
    <limit>child</limit>
    <active>1</active>
    <children>
      <child lootmax="0" lootmin="0" max="2" min="1" type="Land_Ruin_Highway_Pillar1"/>
    </children>
  </event>
  <event name="Staticpvptest_2">
    <nominal>1</nominal>
    <min>0</min>
    <max>0</max>
    <lifetime>300</lifetime>
    <restock>0</restock>
    <saferadius>0</saferadius>
    <distanceradius>0</distanceradius>
    <cleanupradius>0</cleanupradius>
    <flags deletable="0" init_random="0" remove_damaged="0"/>
    <position>fixed</position>
    <limit>child</limit>
    <active>1</active>
    <children>
      <child lootmax="0" lootmin="0" max="2" min="1" type="Land_Ruin_Highway_Pillar1"/>
    </children>
  </event>
  <event name="Staticpvptest_3">
    <nominal>1</nominal>
    <min>0</min>
    <max>0</max>
    <lifetime>300</lifetime>
    <restock>0</restock>
    <saferadius>0</saferadius>
    <distanceradius>0</distanceradius>
    <cleanupradius>0</cleanupradius>
    <flags deletable="0" init_random="0" remove_damaged="0"/>
    <position>fixed</position>
    <limit>child</limit>
    <active>1</active>
    <children>
      <child lootmax="0" lootmin="0" max="2" min="1" type="Land_Ruin_Highway_Pillar1"/>
    </children>
  </event>
  <event name="Staticpvptest_4">
    <nominal>1</nominal>
    <min>0</min>
    <max>0</max>
    <lifetime>300</lifetime>
    <restock>0</restock>
    <saferadius>0</saferadius>
    <distanceradius>0</distanceradius>
    <cleanupradius>0</cleanupradius>
    <flags deletable="0" init_random="0" remove_damaged="0"/>
    <position>fixed</position>
    <limit>child</limit>
    <active>1</active>
    <children>
      <child lootmax="0" lootmin="0" max="2" min="1" type="Land_Ruin_Highway_Pillar1"/>
    </children>
  </event>
</events>
`;
fs.writeFileSync(
  "./out.json",
  JSON.stringify(parser.parse(string, { ignoreAttributes: false }), null, 2)
);
