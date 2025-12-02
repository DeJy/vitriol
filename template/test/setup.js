import m from "mithril";
globalThis.m = m;
const mq = require('mithril-query')
globalThis.mq = mq;
import { describe, expect, it, vi } from 'vitest';
globalThis.expect = expect;
globalThis.describe = describe
globalThis.it = it;
globalThis.vi = vi;
