import * as pdfMake from "pdfmake/build/pdfmake";

(pdfMake).fonts = {
    Roboto: {
        normal: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
        bold: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf",
        italics: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf",
        bolditalics:
            "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf",
    },
};

export default async function getStudentProgressPDF(data) {
    console.log(data);
    var dd = {
        content: [

            {
                table: {
                    widths: '*',
                    body: [
                        [
                            {
                                text: [
                                    { text: "Next Charter School - ", bold: true },
                                    { text: "Student Progress Report", bold: false }
                                ],
                                style: 'header',
                                fillColor: '#13274B',
                                color: '#FFFFFF',
                                margin: [0, 10],
                            }
                        ]
                    ]
                },
                layout: 'noBorders'
            },
            {
                columns: [
                    {
                        width: '*',
                        text: [
                            { text: 'Student: ', bold: false },
                            { text: data.studentName, bold: true },
                        ],
                        bold: true,
                    },
                    {
                        width: '*',
                        alignment: 'right',
                        fontSize: 10,
                        text: [
                            { text: 'Date: ', bold: false },
                            { text: data.date + '\n', bold: true },
                            { text: 'Total progress: ', bold: false },
                            { text: data.percentageCompleted + "%", bold: true },

                        ],
                    }
                ],
                margin: [0, 20, 0, 30],
            }
        ],
        styles: {
            header: {
                fontSize: 14,
                alignment: 'center'
            },
        },
    };

    data.domains.forEach(domain => {
        let domainContent = {
            unbreakable: true,
            stack: [],
            margin: [0, 0, 0, 15],
        };

        domainContent.stack.push({
            table: {
                widths: '*',
                body: [
                    [
                        {
                            columns: [
                                {
                                    width: '*',
                                    text: domain.name.toUpperCase(),
                                    style: 'header',
                                    bold: true,
                                    alignment: 'left',
                                },
                                {
                                    width: '*',
                                    text: [
                                        {
                                            text: "Domain progress: ",
                                            alignment: 'right',
                                        },
                                        {
                                            text: domain.progress + "%",
                                            alignment: 'right',
                                            bold: true,
                                        }
                                    ],
                                    fontSize: 10,
                                },
                            ],
                            border: [false, false, false, true],
                        }
                    ],
                ],
            },
            margin: [0, 0, 0, 10]
        });

        let coursesPairs = [];
        for (let i = 0; i < domain.courses.length; i += 2) {
            coursesPairs.push(domain.courses.slice(i, i + 2));
        }

        coursesPairs.forEach(pair => {
            let pairColumns = {
                columns: []
            };

            pair.forEach((course, courseIndex) => {
                let competenciesGroupedByStatus = course.competencies.reduce((group, competency) => {
                    group[competency.status] = group[competency.status] || [];
                    group[competency.status].push(competency.name);
                    return group;
                }, {});

                pairColumns.columns.push({
                    width: '50%',
                    table: {
                        dontBreakRows: true,
                        widths: '*',
                        body: [
                            [
                                {
                                    text: course.name,
                                    style: 'header',
                                    fontSize: 10,
                                    fillColor: '#13274B',
                                    color: '#FFFFFF',
                                    margin: [0, 1],
                                },
                            ],
                            ...Object.keys(competenciesGroupedByStatus).map(status => {
                                return [
                                    {
                                        text: [
                                            { text: `${status.charAt(0).toUpperCase() + status.slice(1)}: `, bold: true },
                                            { text: competenciesGroupedByStatus[status].join(', '), bold: false },
                                        ],
                                        fontSize: 10,
                                    },
                                ];
                            })
                        ],
                    },
                    margin: courseIndex % 2 === 0 ? [0, 0, 5, 10] : [5, 0, 0, 10],
                });
            });

            domainContent.stack.push(pairColumns);
        });

        dd.content.push(domainContent);
    });

    pdfMake.createPdf(dd).open();
}



