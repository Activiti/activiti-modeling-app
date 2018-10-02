import { BpmnElement } from './elements';
import { BpmnProperty } from './properties';

export const elementsProperties = {
    [BpmnElement.Process]: [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.version,
        BpmnProperty.isExecutable,
        BpmnProperty.documentation,
        BpmnProperty.properties
    ],
    [BpmnElement.IntermediateCatchEvent]: [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation
    ],
    [BpmnElement.IntermediateThrowEvent]: [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation
    ],
    [BpmnElement.StartEvent]: [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation
    ],
    [BpmnElement.EndEvent]: [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation
    ],
    [BpmnElement.SequenceFlow]: [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation
    ],
    [BpmnElement.ExclusiveGateway]: [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation
    ],
    [BpmnElement.InclusiveGateway]: [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation
    ],
    [BpmnElement.ComplexGateway]: [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation
    ],
    [BpmnElement.ParallelGateway]: [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation
    ],
    [BpmnElement.EventBasedGateway]: [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation
    ],
    [BpmnElement.ServiceTask]: [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation,
        BpmnProperty.implementation
    ],
    [BpmnElement.CallActivity]: [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation,
        BpmnProperty.activityName
    ],
    [BpmnElement.UserTask]: [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation,
        BpmnProperty.assignee,
        BpmnProperty.candidateUsers,
        BpmnProperty.candidateGroups,
        BpmnProperty.dueDate,
        BpmnProperty.priority
    ]
};
