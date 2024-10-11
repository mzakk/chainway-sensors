import { NativeEventEmitter, NativeModules } from "react-native";

const { RNChainwaySensors } = NativeModules;

const eventEmitter = new NativeEventEmitter(RNChainwaySensors);

type initializeUhfReader = () => void;
type deInitializeUhfReader = () => void;
type readSingleTag = () => Promise<any>;
type readPower = () => Promise<any>;
type initializeUHFType = () => Promise<any>;
type changePower = (powerValue: any) => Promise<any>;
type AddListener = (cb: (args: any[]) => void) => void;
type RemoveListener = (cb: (args: any[]) => void) => void;
type clearTags = () => void;

type initializeBarcodeReader = () => Promise<boolean>;
type deinitBarcodeReader = () => Promise<boolean>;
type isBarcodeReaderInit = () => Promise<any>;
type startBarcodeScan = () => Promise<any>;
type stopBarcodeScan = () => Promise<any>;

const initializeUhfReader: initializeUhfReader = () =>
  RNChainwaySensors.initializeReader();

const initializeBarcodeReader: initializeBarcodeReader = () =>
  RNChainwaySensors.initiBarcodeReader();

const deInitializeUhfReader: deInitializeUhfReader = () =>
  RNChainwaySensors.deInitializeReader();

const deinitBarcodeReader: deinitBarcodeReader = () =>
  RNChainwaySensors.deinitBarcodeReader();

const isBarcodeReaderInit: isBarcodeReaderInit = () =>
  RNChainwaySensors.isBarcodeReaderInit();

const startBarcodeScan: startBarcodeScan = () =>
  RNChainwaySensors.barcodeRead();

const stopBarcodeScan: stopBarcodeScan = () =>
  RNChainwaySensors.barcodeCancel();

const readSingleTag: readSingleTag = () => RNChainwaySensors.readSingleTag();

const startReadingTags = (callback: (args: any[]) => any) =>
  RNChainwaySensors.startReadingTags(callback);

const stopReadingTags = (callback: (args: any[]) => any) =>
  RNChainwaySensors.stopReadingTags(callback);

const readPower: readPower = () => RNChainwaySensors.readPower();

const changePower: changePower = (powerValue: any) =>
  RNChainwaySensors.changePower(powerValue);

const powerListener: AddListener = (listener) =>
  eventEmitter.addListener("UHF_POWER", listener);

const tagListener: AddListener = (listener) =>
  eventEmitter.addListener("UHF_TAG", listener);

const clearTags: clearTags = () => RNChainwaySensors.clearAllTags();

const initializeUHF: initializeUHFType = () =>
  RNChainwaySensors.initializeUHF();

const deinitializeUHF = () => RNChainwaySensors.deinitializeUHF();

const addBarcodeListener: AddListener = (listener) =>
  eventEmitter.addListener("BARCODE", listener);

const removeBarcodeListener: RemoveListener = (_listener) =>
  // evtEmitter.removeListener('BARCODE', listener);
  eventEmitter.removeAllListeners("BARCODE");

export default {
  initializeUHF,
  deinitializeUHF,
  powerListener,
  tagListener,
  initializeUhfReader,
  readSingleTag,
  startReadingTags,
  stopReadingTags,
  readPower,
  changePower,
  deInitializeUhfReader,
  clearTags,
  initializeBarcodeReader,
  deinitBarcodeReader,
  isBarcodeReaderInit,
  startBarcodeScan,
  stopBarcodeScan,
  addBarcodeListener,
  removeBarcodeListener,
};
