import FS from 'fs';

const writeToSettings = (settingsFile) => {
  const updateSettingsFile = JSON.stringify(settingsFile, null, 2);
  FS.writeFile('../../../../../settings.json', updateSettingsFile, () => {
    // console.log(`Updated settings file..`);
  });
};

const getSettingsFile = () => {
  const settingsFile = JSON.parse(
    FS.readFileSync('../../../../../settings.json')
  );
  return settingsFile;
};

export { writeToSettings, getSettingsFile };
