/*!
 * @license
 * Copyright 2019 Alfresco, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ModelingType, ModelingTypeSuggestion } from '../services/primitive-modeling-types.service';

/* cspell: disable */
export const expectedPrimitiveTypes: { [id: string]: ModelingType } = {
    'boolean': { 'id': 'boolean' },
    'integer': { 'id': 'integer' },
    'string': {
        'id': 'string',
        'methods': [
            {
                'type': 'string',
                'signature': 'charAt',
                'documentation': 'Returns the char value at the specified index.',
                'parameters': [
                    {
                        'label': 'index',
                        'documentation': 'integer'
                    }
                ]
            },
            {
                'type': 'integer',
                'signature': 'codePointAt',
                'documentation': 'Returns the character (Unicode code point) at the specified index.',
                'parameters': [
                    {
                        'label': 'index',
                        'documentation': 'integer'
                    }
                ]
            },
            {
                'type': 'integer',
                'signature': 'codePointBefore',
                'documentation': 'Returns the character (Unicode code point) before the specified index.'
            },
            {
                'type': 'integer',
                'signature': 'codePointCount',
                'documentation': 'Returns the number of Unicode code points in the specified text range of this String.',
                'parameters': [
                    {
                        'label': 'beginIndex',
                        'documentation': 'integer'
                    },
                    {
                        'label': 'endIndex',
                        'documentation': 'integer'
                    }
                ]
            },
            {
                'type': 'integer',
                'signature': 'compareTo',
                'documentation': 'Compares two strings lexicographically.',
                'parameters': [
                    {
                        'label': 'anotherString',
                        'documentation': 'string'
                    }
                ]
            },
            {
                'type': 'integer',
                'signature': 'compareToIgnoreCase',
                'documentation': 'Compares two strings lexicographically, ignoring case differences.',
                'parameters': [
                    {
                        'label': 'str',
                        'documentation': 'string'
                    }
                ]
            },
            {
                'type': 'string',
                'signature': 'concat',
                'documentation': 'Concatenates the specified string to the end of this string.',
                'parameters': [
                    {
                        'label': 'str',
                        'documentation': 'string'
                    }
                ]
            },
            {
                'type': 'boolean',
                'signature': 'contains',
                'documentation': 'Returns true if and only if this string contains the specified sequence of char values.',
                'parameters': [
                    {
                        'label': 's',
                        'documentation': 'string'
                    }
                ]
            },
            {
                'type': 'boolean',
                'signature': 'contentEquals',
                'documentation': 'Compares this string to the specified CharSequence.',
                'parameters': [
                    {
                        'label': 's',
                        'documentation': 'string'
                    }
                ]
            },
            {
                'type': 'boolean',
                'signature': 'endsWith',
                'documentation': 'Tests if this string ends with the specified suffix.',
                'parameters': [
                    {
                        'label': 'suffix',
                        'documentation': 'string'
                    }
                ]
            },
            {
                'type': 'boolean',
                'signature': 'equalsIgnoreCase',
                'documentation': 'Compares this String to another String, ignoring case considerations.',
                'parameters': [
                    {
                        'label': 'anotherString',
                        'documentation': 'string'
                    }
                ]
            },
            {
                'type': 'array',
                'signature': 'getBytes',
                'documentation': 'Encodes this String into a sequence of bytes using the platform\'s default charset, storing the result into a new byte array.'
            },
            {
                'type': 'array',
                'signature': 'getBytes',
                'documentation': 'Encodes this String into a sequence of bytes using the named charset, storing the result into a new byte array.',
                'parameters': [
                    {
                        'label': 'charsetName',
                        'documentation': 'string'
                    }
                ]
            },
            {
                'type': null,
                'signature': 'getChars',
                'documentation': 'Copies characters from this string into the destination character array.',
                'parameters': [
                    {
                        'label': 'srcBegin',
                        'documentation': 'integer'
                    },
                    {
                        'label': 'srcEnd',
                        'documentation': 'integer'
                    },
                    {
                        'label': 'dst',
                        'documentation': 'string'
                    },
                    {
                        'label': 'dstBegin',
                        'documentation': 'integer'
                    }
                ]
            },
            {
                'type': 'integer',
                'signature': 'hashCode',
                'documentation': 'Returns a hash code for this string.'
            },
            {
                'type': 'integer',
                'signature': 'indexOf',
                'documentation': 'Returns the index within this string of the first occurrence of the specified character.',
                'parameters': [
                    {
                        'label': 'ch',
                        'documentation': 'integer'
                    }
                ]
            },
            {
                'type': 'integer',
                'signature': 'indexOf',
                'documentation': 'Returns the index within this string of the first occurrence of the specified character, starting the search at the specified index.',
                'parameters': [
                    {
                        'label': 'ch',
                        'documentation': 'integer'
                    },
                    {
                        'label': 'fromIndex',
                        'documentation': 'integer'
                    }
                ]
            },
            {
                'type': 'integer',
                'signature': 'indexOf',
                'documentation': 'Returns the index within this string of the first occurrence of the specified substring.',
                'parameters': [
                    {
                        'label': 'str',
                        'documentation': 'string'
                    }
                ]
            },
            {
                'type': 'integer',
                'signature': 'indexOf',
                'documentation': 'Returns the index within this string of the first occurrence of the specified substring, starting at the specified index.',
                'parameters': [
                    {
                        'label': 'str',
                        'documentation': 'string'
                    },
                    {
                        'label': 'fromIndex',
                        'documentation': 'integer'
                    }
                ]
            },
            {
                'type': 'string',
                'signature': 'intern',
                'documentation': 'Returns a canonical representation for the string object.'
            },
            {
                'type': 'boolean',
                'signature': 'isBlank',
                'documentation': 'Returns true if the string is empty or contains only white space codepoints, otherwise false.'
            },
            {
                'type': 'boolean',
                'signature': 'isEmpty',
                'documentation': 'Returns true if, and only if, length() is 0.'
            },
            {
                'type': 'integer',
                'signature': 'lastIndexOf',
                'documentation': 'Returns the index within this string of the last occurrence of the specified character.',
                'parameters': [
                    {
                        'label': 'ch',
                        'documentation': 'integer'
                    }
                ]
            },
            {
                'type': 'integer',
                'signature': 'lastIndexOf',
                'documentation': 'Returns the index within this string of the last occurrence of the specified character, searching backward starting at the specified index.',
                'parameters': [
                    {
                        'label': 'ch',
                        'documentation': 'integer'
                    },
                    {
                        'label': 'fromIndex',
                        'documentation': 'integer'
                    }
                ]
            },
            {
                'type': 'integer',
                'signature': 'lastIndexOf',
                'documentation': 'Returns the index within this string of the last occurrence of the specified substring.',
                'parameters': [
                    {
                        'label': 'str',
                        'documentation': 'string'
                    }
                ]
            },
            {
                'type': 'integer',
                'signature': 'lastIndexOf',
                'documentation': 'Returns the index within this string of the last occurrence of the specified substring, searching backward starting at the specified index.',
                'parameters': [
                    {
                        'label': 'str',
                        'documentation': 'string'
                    },
                    {
                        'label': 'fromIndex',
                        'documentation': 'integer'
                    }
                ]
            },
            {
                'type': 'integer',
                'signature': 'length',
                'documentation': 'Returns the length of this string.'
            },
            {
                'type': 'boolean',
                'signature': 'matches',
                'documentation': 'Tells whether or not this string matches the given regular expression.',
                'parameters': [
                    {
                        'label': 'regex',
                        'documentation': 'string'
                    }
                ]
            },
            {
                'type': 'integer',
                'signature': 'offsetByCodePoints',
                'documentation': 'Returns the index within this String that is offset from the given index by codePointOffset code points.',
                'parameters': [
                    {
                        'label': 'index',
                        'documentation': 'integer'
                    },
                    {
                        'label': 'codePointOffset',
                        'documentation': 'integer'
                    }
                ]
            },
            {
                'type': 'boolean',
                'signature': 'regionMatches',
                'documentation': 'Tests if two string regions are equal.',
                'parameters': [
                    {
                        'label': 'ignoreCase',
                        'documentation': 'boolean'
                    },
                    {
                        'label': 'toffset',
                        'documentation': 'integer'
                    },
                    {
                        'label': 'other',
                        'documentation': 'string'
                    },
                    {
                        'label': 'ooffset',
                        'documentation': 'integer'
                    },
                    {
                        'label': 'len',
                        'documentation': 'integer'
                    }
                ]
            },
            {
                'type': 'boolean',
                'signature': 'regionMatches',
                'documentation': 'Tests if two string regions are equal.',
                'parameters': [
                    {
                        'label': 'toffset',
                        'documentation': 'integer'
                    },
                    {
                        'label': 'other',
                        'documentation': 'string'
                    },
                    {
                        'label': 'ooffset',
                        'documentation': 'integer'
                    },
                    {
                        'label': 'len',
                        'documentation': 'integer'
                    }
                ]
            },
            {
                'type': 'string',
                'signature': 'repeat',
                'documentation': 'Returns a string whose value is the concatenation of this string repeated count times.',
                'parameters': [
                    {
                        'label': 'count',
                        'documentation': 'integer'
                    }
                ]
            },
            {
                'type': 'string',
                'signature': 'replace',
                'documentation': 'Returns a string resulting from replacing all occurrences of oldChar in this string with newChar.',
                'parameters': [
                    {
                        'label': 'oldChar',
                        'documentation': 'string'
                    },
                    {
                        'label': 'newChar',
                        'documentation': 'string'
                    }
                ]
            },
            {
                'type': 'string',
                'signature': 'replaceAll',
                'documentation': 'Replaces each substring of this string that matches the given regular expression with the given replacement.',
                'parameters': [
                    {
                        'label': 'regex',
                        'documentation': 'string'
                    },
                    {
                        'label': 'replacement',
                        'documentation': 'string'
                    }
                ]
            },
            {
                'type': 'string',
                'signature': 'replaceFirst',
                'documentation': 'Replaces the first substring of this string that matches the given regular expression with the given replacement.',
                'parameters': [
                    {
                        'label': 'regex',
                        'documentation': 'string'
                    },
                    {
                        'label': 'replacement',
                        'documentation': 'string'
                    }
                ]
            },
            {
                'type': 'array-string',
                'signature': 'split',
                'documentation': 'Splits this string around matches of the given regular expression.',
                'parameters': [
                    {
                        'label': 'regex',
                        'documentation': 'string'
                    }
                ]
            },
            {
                'type': 'array-string',
                'signature': 'split',
                'documentation': 'Splits this string around matches of the given regular expression.',
                'parameters': [
                    {
                        'label': 'regex',
                        'documentation': 'string'
                    },
                    {
                        'label': 'limit',
                        'documentation': 'integer'
                    }
                ]
            },
            {
                'type': 'boolean',
                'signature': 'startsWith',
                'documentation': 'Tests if this string starts with the specified prefix.',
                'parameters': [
                    {
                        'label': 'prefix',
                        'documentation': 'string'
                    }
                ]
            },
            {
                'type': 'boolean',
                'signature': 'startsWith',
                'documentation': 'Tests if the substring of this string beginning at the specified index starts with the specified prefix.',
                'parameters': [
                    {
                        'label': 'prefix',
                        'documentation': 'string'
                    },
                    {
                        'label': 'offset',
                        'documentation': 'integer'
                    }
                ]
            },
            {
                'type': 'string',
                'signature': 'strip',
                'documentation': 'Returns a string whose value is this string, with all leading and trailing white space removed.'
            },
            {
                'type': 'string',
                'signature': 'stripLeading',
                'documentation': 'Returns a string whose value is this string, with all leading white space removed.'
            },
            {
                'type': 'string',
                'signature': 'stripTrailing',
                'documentation': 'Returns a string whose value is this string, with all trailing white space removed.'
            },
            {
                'type': 'string',
                'signature': 'substring',
                'documentation': 'Returns a string that is a substring of this string.',
                'parameters': [
                    {
                        'label': 'beginIndex',
                        'documentation': 'integer'
                    }
                ]
            },
            {
                'type': 'string',
                'signature': 'substring',
                'documentation': 'Returns a string that is a substring of this string.',
                'parameters': [
                    {
                        'label': 'beginIndex',
                        'documentation': 'integer'
                    },
                    {
                        'label': 'endIndex',
                        'documentation': 'integer'
                    }
                ]
            },
            {
                'type': 'array',
                'signature': 'toCharArray',
                'documentation': 'Converts this string to a new character array.'
            },
            {
                'type': 'string',
                'signature': 'toLowerCase',
                'documentation': 'Converts all of the characters in this String to lower case using the rules of the default locale.'
            },
            {
                'type': 'string',
                'signature': 'toUpperCase',
                'documentation': 'Converts all of the characters in this String to upper case using the rules of the default locale.'
            },
            {
                'type': 'string',
                'signature': 'trim',
                'documentation': 'Returns a string whose value is this string, with all leading and trailing space removed, where space is defined as any character whose codepoint is less than or equal to \'U+ 0020\' (the space character).'
            },
            {
                'signature': 'equals',
                'type': 'boolean',
                'documentation': 'Indicates whether some other object is "equal to" this one.',
                'parameters': [
                    {
                        'label': 'obj',
                        'documentation': 'obj: object – the reference object with which to compare'
                    }
                ]
            },
            {
                'signature': 'hashCode',
                'type': 'integer',
                'documentation': 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.'
            },
            {
                'signature': 'toString',
                'type': 'string',
                'documentation': 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.'
            }
        ],
        'properties': undefined
    },
    'json': {
        'id': 'json',
        'methods': [{
            'signature': 'equals',
            'type': 'boolean',
            'documentation': 'Indicates whether some other object is "equal to" this one.',
            'parameters': [{
                'label': 'obj',
                'documentation': 'obj: object – the reference object with which to compare'
            }]
        },
        {
            'signature': 'hashCode',
            'type': 'integer',
            'documentation': 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.'
        },
        {
            'signature': 'toString',
            'type': 'string',
            'documentation': 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.'
        }]
    },
    'date': {
        'id': 'date',
        'methods': [{
            'signature': 'after',
            'type': 'boolean',
            'documentation': 'Tests if this date is after the specified date.',
            'parameters': [{
                'label': 'date',
                'documentation': 'date: date – the reference object with which to compare'
            }]
        },
        {
            'signature': 'before',
            'type': 'boolean',
            'documentation': 'Tests if this date is before the specified date.',
            'parameters': [{
                'label': 'date',
                'documentation': 'date: date – the reference object with which to compare'
            }]
        },
        {
            'signature': 'compareTo',
            'type': 'integer',
            'documentation': 'Compares two Dates for ordering.',
            'parameters': [{
                'label': 'anotherDate',
                'documentation': 'anotherDate: date – the date to be compared'
            }]
        },
        {
            'signature': 'getTime',
            'type': 'integer',
            'documentation': 'Returns the number of milliseconds since January 1, 1970, 00:00:00 GMT represented by this Date object.'
        },
        {
            'signature': 'setTime',
            'type': null,
            'documentation': 'Sets this Date object to represent a point in time that is time milliseconds after January 1, 1970 00:00:00 GMT.',
            'parameters': [{
                'label': 'time',
                'documentation': 'time: integer – the number of milliseconds'
            }]
        },
        {
            'signature': 'equals',
            'type': 'boolean',
            'documentation': 'Indicates whether some other object is "equal to" this one.',
            'parameters': [{
                'label': 'obj',
                'documentation': 'obj: object – the reference object with which to compare'
            }]
        },
        {
            'signature': 'hashCode',
            'type': 'integer',
            'documentation': 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.'
        },
        {
            'signature': 'toString',
            'type': 'string',
            'documentation': 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.'
        }],
        'properties': undefined
    },
    'datetime': {
        'id': 'datetime',
        'methods': [{
            'signature': 'after',
            'type': 'boolean',
            'documentation': 'Tests if this date is after the specified date.',
            'parameters': [{
                'label': 'date',
                'documentation': 'date: date – the reference object with which to compare'
            }]
        },
        {
            'signature': 'before',
            'type': 'boolean',
            'documentation': 'Tests if this date is before the specified date.',
            'parameters': [{
                'label': 'date',
                'documentation': 'date: date – the reference object with which to compare'
            }]
        },
        {
            'signature': 'compareTo',
            'type': 'integer',
            'documentation': 'Compares two Dates for ordering.',
            'parameters': [{
                'label': 'anotherDate',
                'documentation': 'anotherDate: date – the date to be compared'
            }]
        },
        {
            'signature': 'getTime',
            'type': 'integer',
            'documentation': 'Returns the number of milliseconds since January 1, 1970, 00:00:00 GMT represented by this Date object.'
        },
        {
            'signature': 'setTime',
            'type': null,
            'documentation': 'Sets this Date object to represent a point in time that is time milliseconds after January 1, 1970 00:00:00 GMT.',
            'parameters': [{
                'label': 'time',
                'documentation': 'time: integer – the number of milliseconds'
            }]
        },
        {
            'signature': 'equals',
            'type': 'boolean',
            'documentation': 'Indicates whether some other object is "equal to" this one.',
            'parameters': [{
                'label': 'obj',
                'documentation': 'obj: object – the reference object with which to compare'
            }]
        },
        {
            'signature': 'hashCode',
            'type': 'integer',
            'documentation': 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.'
        },
        {
            'signature': 'toString',
            'type': 'string',
            'documentation': 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.'
        }],
        'properties': undefined
    },
    'array': {
        'id': 'array',
        'collectionOf': 'json',
        'properties': [
            {
                'property': 'length',
                'type': 'integer',
                'documentation': 'Return the number of elements in the array'
            },
            undefined],
        'methods': [{
            'signature': 'equals',
            'type': 'boolean',
            'documentation': 'Indicates whether some other object is "equal to" this one.',
            'parameters': [{
                'label': 'obj',
                'documentation': 'obj: object – the reference object with which to compare'
            }]
        },
        {
            'signature': 'hashCode',
            'type': 'integer',
            'documentation': 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.'
        },
        {
            'signature': 'toString',
            'type': 'string',
            'documentation': 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.'
        }]
    },
    'file': {
        'id': 'file',
        'collectionOf': 'content',
        'methods': [{
            'signature': 'equals',
            'type': 'boolean',
            'documentation': 'Indicates whether some other object is "equal to" this one.',
            'parameters': [{
                'label': 'obj',
                'documentation': 'obj: object – the reference object with which to compare'
            }]
        },
        {
            'signature': 'hashCode',
            'type': 'integer',
            'documentation': 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.'
        },
        {
            'signature': 'toString',
            'type': 'string',
            'documentation': 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.'
        }],
        'properties': [{
            'property': 'length',
            'type': 'integer',
            'documentation': 'Return the number of elements in the array'
        },
            undefined,
        {
            'property': 'id',
            'type': 'string',
            'documentation': 'Node identifier'
        },
        {
            'property': 'name',
            'type': 'string',
            'documentation': 'Node name'
        },
        {
            'property': 'uri',
            'type': 'string',
            'documentation': 'Node URI'
        },
        {
            'property': 'content',
            'type': 'content-metadata',
            'documentation': 'Node content metadata'
        },
            undefined]
    },
    'folder': {
        'id': 'folder',
        'methods': [{
            'signature': 'equals',
            'type': 'boolean',
            'documentation': 'Indicates whether some other object is "equal to" this one.',
            'parameters': [{
                'label': 'obj',
                'documentation': 'obj: object – the reference object with which to compare'
            }]
        },
        {
            'signature': 'hashCode',
            'type': 'integer',
            'documentation': 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.'
        },
        {
            'signature': 'toString',
            'type': 'string',
            'documentation': 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.'
        }],
        'properties': [{
            'property': 'length',
            'type': 'integer',
            'documentation': 'Return the number of elements in the array'
        },
            undefined,
        {
            'property': 'id',
            'type': 'string',
            'documentation': 'Node identifier'
        },
        {
            'property': 'name',
            'type': 'string',
            'documentation': 'Node name'
        },
        {
            'property': 'uri',
            'type': 'string',
            'documentation': 'Node URI'
        },
        {
            'property': 'content',
            'type': 'content-metadata',
            'documentation': 'Node content metadata'
        },
            undefined],
        'collectionOf': 'content'
    },
    'content': {
        'id': 'content',
        'hidden': true,
        'properties': [{
            'property': 'id',
            'type': 'string',
            'documentation': 'Node identifier'
        },
        {
            'property': 'name',
            'type': 'string',
            'documentation': 'Node name'
        },
        {
            'property': 'uri',
            'type': 'string',
            'documentation': 'Node URI'
        },
        {
            'property': 'content',
            'type': 'content-metadata',
            'documentation': 'Node content metadata'
        },
            undefined],
        'methods': [{
            'signature': 'equals',
            'type': 'boolean',
            'documentation': 'Indicates whether some other object is "equal to" this one.',
            'parameters': [{
                'label': 'obj',
                'documentation': 'obj: object – the reference object with which to compare'
            }]
        },
        {
            'signature': 'hashCode',
            'type': 'integer',
            'documentation': 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.'
        },
        {
            'signature': 'toString',
            'type': 'string',
            'documentation': 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.'
        }]
    },
    'content-metadata': {
        'id': 'content-metadata',
        'hidden': true,
        'properties': [{
            'property': 'sizeInBytes',
            'type': 'integer',
            'documentation': 'Node size in bytes'
        },
        {
            'property': 'mimeType',
            'type': 'string',
            'documentation': 'Node mime type'
        },
        {
            'property': 'uri',
            'type': 'string',
            'documentation': 'Node URI'
        },
            undefined],
        'methods': [{
            'signature': 'equals',
            'type': 'boolean',
            'documentation': 'Indicates whether some other object is "equal to" this one.',
            'parameters': [{
                'label': 'obj',
                'documentation': 'obj: object – the reference object with which to compare'
            }]
        },
        {
            'signature': 'hashCode',
            'type': 'integer',
            'documentation': 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.'
        },
        {
            'signature': 'toString',
            'type': 'string',
            'documentation': 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.'
        }]
    },
    'array-string': {
        'id': 'array-string',
        'methods': [{
            'signature': 'equals',
            'type': 'boolean',
            'documentation': 'Indicates whether some other object is "equal to" this one.',
            'parameters': [{
                'label': 'obj',
                'documentation': 'obj: object – the reference object with which to compare'
            }]
        },
        {
            'signature': 'hashCode',
            'type': 'integer',
            'documentation': 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.'
        },
        {
            'signature': 'toString',
            'type': 'string',
            'documentation': 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.'
        }],
        'properties': [{
            'property': 'length',
            'type': 'integer',
            'documentation': 'Return the number of elements in the array'
        },
            undefined],
        'collectionOf': 'string',
        'hidden': true
    }
};

export const expectedArrayMethodSuggestions: ModelingTypeSuggestion[] = [
    {
        'label': 'equals(obj): boolean',
        'filterText': 'equals',
        'kind': 0,
        'insertText': 'equals(${1:obj})',
        'documentation': 'Indicates whether some other object is "equal to" this one.',
        'detail': 'boolean',
        'insertTextRules': 4,
        'command': {
            'id': 'editor.action.triggerParameterHints'
        }
    },
    {
        'label': 'hashCode(): integer',
        'filterText': 'hashCode',
        'kind': 0,
        'insertText': 'hashCode()',
        'documentation': 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.',
        'detail': 'integer'
    },
    {
        'label': 'toString(): string',
        'filterText': 'toString',
        'kind': 0,
        'insertText': 'toString()',
        'documentation': 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.',
        'detail': 'string'
    }
];

export const expectedArrayPropertiesSuggestions: ModelingTypeSuggestion[] = [
    {
        'label': 'length',
        'filterText': 'length',
        'kind': 9,
        'insertText': 'length',
        'documentation': 'Return the number of elements in the array',
        'detail': 'integer'
    }
];

export const expectedArraySignatureHelpers = [
    {
        'label': 'equals(obj): boolean',
        'documentation': 'Indicates whether some other object is "equal to" this one.',
        'parameters': [
            {
                'label': 'obj',
                'documentation': 'obj: object – the reference object with which to compare'
            }
        ],
        'method': {
            'signature': 'equals',
            'type': 'boolean',
            'documentation': 'Indicates whether some other object is "equal to" this one.',
            'parameters': [
                {
                    'label': 'obj',
                    'documentation': 'obj: object – the reference object with which to compare'
                }
            ]
        }
    },
    {
        'label': 'hashCode(): integer',
        'documentation': 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.',
        'method': {
            'signature': 'hashCode',
            'type': 'integer',
            'documentation': 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.'
        }
    },
    {
        'label': 'toString(): string',
        'documentation': 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.',
        'method': {
            'signature': 'toString',
            'type': 'string',
            'documentation': 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.'
        }
    }
];
