// encoder.js (server-side)

const items_secret_key = "PBG892FXX982ABC*"; const MAX_BUFFER_SIZE = 5 * 1024 * 1024; // 5MB buffer

function createBuffer() { return new Uint8Array(MAX_BUFFER_SIZE); }

function writeNumber(buf, pos, len, value) { for (let i = 0; i < len; i++) { buf[pos + i] = (value >> (i * 8)) & 255; } }

function writeString(buf, pos, len, value, useKey = false, item_id = 0) { for (let i = 0; i < len; i++) { const char = value.charCodeAt(i); buf[pos + i] = useKey ? char ^ items_secret_key.charCodeAt(i % items_secret_key.length) : char; } }

function hexStringToBuffer(buf, pos, hexString) { hexString = hexString.replace(/ /g, ""); const matches = hexString.match(/.{2}/g); if (!matches) return 0; matches.forEach((hex, i) => { buf[pos + i] = parseInt(hex, 16); }); return matches.length; }

function calcHash(buffer, length) { let hash = 0x55555555; for (let i = 0; i < length; i++) { hash = (hash >>> 27) + (hash << 5) + buffer[i]; } return hash >>> 0; // ensure unsigned }

function encodeItems(data) { const buf = createBuffer(); let pos = 0;

writeNumber(buf, pos, 2, data.version); writeNumber(buf, pos + 2, 4, data.item_count); pos = 6;

for (let item of data.items) { writeNumber(buf, pos, 4, item.item_id); pos += 4; buf[pos++] = item.editable_type; buf[pos++] = item.item_category; buf[pos++] = item.action_type; buf[pos++] = item.hit_sound_type;

writeNumber(buf, pos, 2, item.name.length); pos += 2;
writeString(buf, pos, item.name.length, item.name, true, item.item_id); pos += item.name.length;

writeNumber(buf, pos, 2, item.texture.length); pos += 2;
writeString(buf, pos, item.texture.length, item.texture); pos += item.texture.length;

writeNumber(buf, pos, 4, item.texture_hash); pos += 4;
buf[pos++] = item.item_kind;
writeNumber(buf, pos, 4, item.val1); pos += 4;
buf[pos++] = item.texture_x;
buf[pos++] = item.texture_y;
buf[pos++] = item.spread_type;
buf[pos++] = item.is_stripey_wallpaper;
buf[pos++] = item.collision_type;

if (typeof item.break_hits === 'string' && item.break_hits.endsWith('r')) {
  buf[pos++] = parseInt(item.break_hits.slice(0, -1));
} else {
  buf[pos++] = item.break_hits * 6;
}

writeNumber(buf, pos, 4, item.drop_chance); pos += 4;
buf[pos++] = item.clothing_type;
writeNumber(buf, pos, 2, item.rarity); pos += 2;
buf[pos++] = item.max_amount;

writeNumber(buf, pos, 2, item.extra_file.length); pos += 2;
writeString(buf, pos, item.extra_file.length, item.extra_file); pos += item.extra_file.length;

writeNumber(buf, pos, 4, item.extra_file_hash); pos += 4;
writeNumber(buf, pos, 4, item.audio_volume); pos += 4;

writeNumber(buf, pos, 2, item.pet_name.length); pos += 2;
writeString(buf, pos, item.pet_name.length, item.pet_name); pos += item.pet_name.length;

writeNumber(buf, pos, 2, item.pet_prefix.length); pos += 2;
writeString(buf, pos, item.pet_prefix.length, item.pet_prefix); pos += item.pet_prefix.length;

writeNumber(buf, pos, 2, item.pet_suffix.length); pos += 2;
writeString(buf, pos, item.pet_suffix.length, item.pet_suffix); pos += item.pet_suffix.length;

writeNumber(buf, pos, 2, item.pet_ability.length); pos += 2;
writeString(buf, pos, item.pet_ability.length, item.pet_ability); pos += item.pet_ability.length;

buf[pos++] = item.seed_base;
buf[pos++] = item.seed_overlay;
buf[pos++] = item.tree_base;
buf[pos++] = item.tree_leaves;

buf[pos++] = item.seed_color.a;
buf[pos++] = item.seed_color.r;
buf[pos++] = item.seed_color.g;
buf[pos++] = item.seed_color.b;

buf[pos++] = item.seed_overlay_color.a;
buf[pos++] = item.seed_overlay_color.r;
buf[pos++] = item.seed_overlay_color.g;
buf[pos++] = item.seed_overlay_color.b;

writeNumber(buf, pos, 4, 0); pos += 4; // ingredients

writeNumber(buf, pos, 4, item.grow_time); pos += 4;
writeNumber(buf, pos, 2, item.val2); pos += 2;
writeNumber(buf, pos, 2, item.is_rayman); pos += 2;

writeNumber(buf, pos, 2, item.extra_options.length); pos += 2;
writeString(buf, pos, item.extra_options.length, item.extra_options); pos += item.extra_options.length;

writeNumber(buf, pos, 2, item.texture2.length); pos += 2;
writeString(buf, pos, item.texture2.length, item.texture2); pos += item.texture2.length;

writeNumber(buf, pos, 2, item.extra_options2.length); pos += 2;
writeString(buf, pos, item.extra_options2.length, item.extra_options2); pos += item.extra_options2.length;

pos += hexStringToBuffer(buf, pos, item.data_position_80);

if (data.version >= 11) {
  writeNumber(buf, pos, 2, item.punch_options.length); pos += 2;
  writeString(buf, pos, item.punch_options.length, item.punch_options); pos += item.punch_options.length;
}
if (data.version >= 12) {
  pos += hexStringToBuffer(buf, pos, item.data_version_12);
}
if (data.version >= 13) {
  writeNumber(buf, pos, 4, item.int_version_13); pos += 4;
}
if (data.version >= 14) {
  writeNumber(buf, pos, 4, item.int_version_14); pos += 4;
}
if (data.version >= 15) {
  pos += hexStringToBuffer(buf, pos, item.data_version_15);
  writeNumber(buf, pos, 2, item.str_version_15.length); pos += 2;
  writeString(buf, pos, item.str_version_15.length, item.str_version_15); pos += item.str_version_15.length;
}
if (data.version >= 16) {
  writeNumber(buf, pos, 2, item.str_version_16.length); pos += 2;
  writeString(buf, pos, item.str_version_16.length, item.str_version_16); pos += item.str_version_16.length;
}
if (data.version >= 17) {
  writeNumber(buf, pos, 4, item.int_version_17); pos += 4;
}
if (data.version >= 18) {
  writeNumber(buf, pos, 4, item.int_version_18); pos += 4;
}
if (data.version >= 19) {
  writeNumber(buf, pos, 9, item.int_version_19); pos += 9;
}
if (data.version >= 21) {
  writeNumber(buf, pos, 2, item.int_version_21); pos += 2;
}

}

const result = buf.slice(0, pos); const hash = calcHash(result, result.length); return { buffer: result, hash }; }

export { encodeItems };

